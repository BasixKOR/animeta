/* global _gaq */
/* global Raven */
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import {createHistory, useQueries} from 'history';
import nprogress from 'nprogress';
import {matchRoute} from './Isomorphic';
import dedupeClient from './dedupeClient';
import TempRouterProvider from './TempRouterProvider';
import 'nprogress/nprogress.css';

if (!process.env.CLIENT) {
    throw new Error('IsomorphicClient should be imported from browser side')
}

function createClient() {
    return dedupeClient({
        call(path, params) {
            return $.get('/api/v2' + path, params);
        },

        getCurrentUser() {
            return $.ajax({url: '/api/v2/me', __silent__: true}).then(undefined, jqXHR => {
                var deferred = $.Deferred();
                if (jqXHR.statusCode)
                    deferred.resolve(null);
                else
                    deferred.reject(jqXHR);
                return deferred;
            });
        }
    });
}

function onPageTransition() {
    if (_gaq) {
        _gaq.push(['_trackPageview']);
    }
}

$(document).ajaxError((event, jqXHR, ajaxSettings, thrownError) => {
    if (ajaxSettings.__silent__)
        return;

    try {
        Raven.captureMessage(thrownError || jqXHR.statusText, {
            extra: {
                type: ajaxSettings.type,
                url: ajaxSettings.url,
                data: ajaxSettings.data,
                status: jqXHR.status,
                error: thrownError || jqXHR.statusText,
                response: jqXHR.responseText && jqXHR.responseText.substring(0, 100)
            }
        });
    } catch (e) {
        Raven.captureMessage(e);
    }
    if (jqXHR.responseText) {
        try {
            var err = $.parseJSON(jqXHR.responseText);
            alert(err.message);
            return;
        } catch (e) {
            // ignore
        }
    }
    alert('서버 오류로 요청에 실패했습니다.');
});

export function render(app, container) {
    const history = useQueries(createHistory)();

    const renderRoute = (Component, props, done) => {
        ReactDOM.render(
            <TempRouterProvider history={history}>
                <Component {...props} />
            </TempRouterProvider>,
            container,
            done
        );
    };

    var lastRequestID = 0;
    const initialRouteProps = global.PreloadData.routeProps;

    const listener = (location, callback) => {
        const done = () => callback();
        const match = matchRoute(app, location.pathname);
        if (!match) {
            // TODO: 404
            done();
            return;
        }
        const {Component, fetchData} = match.route;
        const requestID = ++lastRequestID;

        if (requestID === 1 && initialRouteProps) {
            renderRoute(Component, initialRouteProps, done);
            global.PreloadData.routeProps = null;
        } else {
            const request = {
                app,
                client: createClient(),
                params: match.params,
                query: location.query,
            };
            nprogress.start();
            Promise.resolve(fetchData(request)).then(data => {
                if (requestID != lastRequestID)
                    return;

                if (data.redirect) {
                    history.push(data.redirect);
                    return;
                }

                var {props, pageTitle = '', allowReuse = false} = data;

                nprogress.done();

                if (requestID > 1)
                    onPageTransition();

                if (!allowReuse)
                    ReactDOM.unmountComponentAtNode(container);

                if (pageTitle)
                    pageTitle += ' - ';
                document.title = pageTitle + '애니메타';

                renderRoute(Component, props, () => {
                    done();

                    if (location.action === 'PUSH')
                        window.scrollTo(0, 0)
                });
            }, e => {
                // TODO: show error
            })
        }
    };

    history.listenBefore(listener);
    listener(history.createLocation(window.location), () => {});
}
