# kong-deck
This is a short-lived Docker container with Kong's [decK](https://docs.konghq.com/deck/) tool installed.

Its primary purpose is to ensure that the current Kong configuration is synced up to what is defined is `kong.yaml`.

Note that consumers are specifically excluded from the sync operation, so consumers created by the `auth` service will not be deleted by `kong-deck`.

