# Backend Server for VISDOM Educational Dashboard

<!-- no toc -->
- [Build instructions](#build-instructions)
- [Deployment instructions](#deployment-instructions)
- [Uninstall instructions](#uninstall-instructions)

## Build instructions

This build step can be done at any machine that has access to the GitLab repositories and to the Docker registry.

```bash
git clone git@github.com:visdom-project/VISDOM-educational-dashboard.git
cd VISDOM-educational-dashboard

npm clean-install
# at this point create .env file in the following format (with the correct values for the variables)
    # REACT_APP_ELASTICSEARCH_HOST=
    # REACT_APP_CONFIG_HOST=
    # REACT_APP_ADAPTER_HOST=/api
    # REACT_APP_TOKEN=
    # REACT_APP_COURSE_ID=
npm run-script build

cd ..
git clone git@github.com:visdom-project/VISDOM-backend-server-edu-dashboard.git
cd VISDOM-backend-server-edu-dashboard
cp -R ../VISDOM-educational-dashboard/build/* public

cp .env.template .env
# at this point edit file .env with the image names and the host port

docker-compose build

docker push $(cat .env | grep EDU_DASHBOARD_IMAGE | cut -d'=' -f2)
docker push $(cat .env | grep EDU_DASHBOARD_NGINX_IMAGE | cut -d'=' -f2)
```

## Deployment instructions

This first step is done at the build machine.

In the following:

- `<HOST_SERVER>` is the host server
- `<HOST_USER>` is the username that is used at the host server
- `<HOST_FOLDER>` is the folder that is used at the host server

```bash
# the following is done from the build folder
ssh <USERNAME>@<HOST_MACHINE> mkdir -p <HOST_FOLDER>
scp .env <USERNAME>@<HOST_MACHINE>:<HOST_FOLDER>
scp docker-compose.yml <USERNAME>@<HOST_MACHINE>:<HOST_FOLDER>
```

The final step is done at the host server.

In the following:

- `<HTTP_USERNAME>` is the username required to access the web page
- `<HTTP_PASSWORD>` is the password required to access the web page

```bash
cd <HOST_FOLDER>
docker pull $(cat .env | grep EDU_DASHBOARD_IMAGE | cut -d'=' -f2)
docker pull $(cat .env | grep EDU_DASHBOARD_NGINX_IMAGE | cut -d'=' -f2)

export SECRET_PASSWORD=<HTTP_PASSWORD>
echo "$SECRET_PASSWORD" | htpasswd -ci pass.wd <HTTP_USERNAME>
docker-compose up --no-build -d
```

The dashboard will be available at the host port defined at `.env` file.

## Uninstall instructions

```bash
cd HOST_FOLDER
docker-compose down --remove-orphans
docker rmi $(cat .env | grep EDU_DASHBOARD_IMAGE | cut -d'=' -f2)
docker rmi $(cat .env | grep EDU_DASHBOARD_NGINX_IMAGE | cut -d'=' -f2)
```
