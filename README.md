# etcd3d
etcd3d is a simply dashboard of key-value store `etcd`.
*The client uses etcd v3 APIs only.* support for the v2 API is not planned.

## Overview

## Installation - Quick start

```
$ git clone {{repository}}
```

### on Docker

Ⅰ. Deploying

```
$ cd etcd3d
$ docker-compose -f docker-compose-local-cluster.yml up -d
```
or
```
$ docker-compose -f docker-compose-local.yml up -d
```

`*-cluster.yml` is multiple etcd clusters.


Ⅱ. Puting Initial data
```
$ docker-compose exec web /bin/bash
# ./initkvs
```

### on Bare (SimpleHttpMM)
```
$ cd etcd3d
$ pip install -r requirements.txt
$ npm install
$ python manager.py runserver
```

### Configuration

(optionally) configure the application settings by editing the file:
`~/etcd3d/local/local_settings.py`

### Usage

- *[Dashboard]*
  - system overview.

- *[KvS]*
  - Search the key, and assigns the specified value with the specified key.

- *[Graph]*
  - show you the tree view. (is Alpha)

- *[Settings] -> [Shortcut]*
  - tagging for search keywords. (e.g., tag: app1, key:/data/app1)

- *http://{server}/#!/extensions*
  - extensions apps.

## License
The work done has been licensed under MIT License. The license file can be found [here](LICENSE).
You can find out more about the license at [opensource.org/licenses/MIT](https://opensource.org/licenses/MIT).
