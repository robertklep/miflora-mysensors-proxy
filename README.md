# MiFlora — MySensors MQTT proxy

Proxy that listens to [MiFlora MQTT](https://github.com/ThomDietrich/miflora-mqtt-daemon) messages and republishes them as [MySensors MQTT](https://www.mysensors.org/) messages.

### Installation

```
npm i -g robertklep/miflora-mysensors-proxy
```

### Usage

* Copy `.miflora-mysensors-proxyrc-example` to your home directory:

  ```cp .miflora-mysensors-proxyrc-example $HOME/.miflora-mysensors-proxyrc```

  **NB**: notice the `.` in front of the filenames. They should remain there.

* Edit the RC file. It should be self-explanatory.
* Start the proxy server:

  ```miflora-mysensors-proxy```

* It should keep running and do its work.

If you want more feedback, you can start it in debugging mode:

```
env DEBUG=miflora-mysensors-proxy miflora-mysensors-proxy
```
