from fabric.api import *

env.hosts = ['animeta.net']

def deploy():
    _deploy(newapi=True, frontend=True)

def deploy_api():
    _deploy(api=True)

def deploy_newapi():
    _deploy(newapi=True)

def deploy_frontend():
    _deploy(frontend=True)

def deploy_frontend_server():
    _deploy(frontend_server=True)

def deploy_servers():
    _deploy(newapi=True, frontend_server=True)

def _deploy(api=False, newapi=False, frontend=False, frontend_server=False):
    if frontend:
        frontend_server = True

    local('git push')
    with cd('/home/ditto/animeta'):
        run('git pull') # To get password prompt first
        if newapi:
            with lcd('backend'):
                local('./gradlew build')
        if frontend:
            local('rm -f animeta/static/build/*')
            local('NODE_ENV=production ./node_modules/.bin/webpack')

        if frontend_server:
            run('npm install')
        if api:
            with cd('backend-legacy'):
                run('../venv/bin/pip install -r ./requirements.txt')
                run('../venv/bin/python manage.py migrate')
        if newapi:
            put('backend/build/libs/backend-1.0.0.war', 'backend.war.tmp')
        if frontend:
            run('mkdir -p animeta/static/build')
            put('animeta/static/build/*', 'animeta/static/build/')
            put('frontend/assets.json', 'frontend/')
        if frontend_server:
            run('rm -rf frontend-dist')
            run('./node_modules/.bin/babel frontend --ignore external/** -d frontend-dist --copy-files')

        if newapi:
            run('mv backend.war.tmp backend-1.0.0.war')
        if frontend_server:
            run('pm2 gracefulReload animeta')
