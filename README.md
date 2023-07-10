# HTTP3 vs HTTP2 testing script

A testing script which uses [Puppeteer](https://pptr.dev) with a headless Chrome
and exports network traces from DevTools into a `HAR` file.

It gives an option to run it in HTTP1/HTTP2-only mode or HTTP3 with a fallback to the older versions.

## Preparations

The primary condition is the server must support HTTP3 and QUIC protocol.
NGINX binaries have the QUIC enabled by default since the version 1.25.0, 
including also the NGINX Docker image.
You can try [NGINX in pair with Brotli](https://github.com/KiweeEu/nginx-brotli) compression module from our repository too. 

The earlier versions of NGINX also support QUIC but need to be [compiled](https://nginx.org/en/docs/quic.html) with
the `--with-http_v3_module` parameter.

### Build test script container image

```shell
docker build -t httptest .
```

## Test page on HTTP3

```shell
docker run -i --init --cap-add=SYS_ADMIN --rm -v $(pwd)/data/http3:/home/pptruser/output -e TEST_PAGE_URL=https://www.google.com httptest \
 node test.js --enable-quic --origin-to-force-quic-on=www.google.com:443
```

The last 2 parameters are passed over to Chrome. The `--enable-quic` ensures QUIC support is enabled.
The `--origin-to-force-quic-on=<host><:port>;` enforces QUIC for the given host and port.
Note that the port is mandatory, even though if it is the default one `443`.

## Test page on HTTP2

```shell
docker run -i --init --cap-add=SYS_ADMIN --rm -v $(pwd)/data/http2:/home/pptruser/output TEST_PAGE_URL=https://www.google.com httptest \
 node test.js --disable-quic
```

The `--disable-quic` parameter guarantees that HTTP3 will not be used as Chrome in the current versions has this enabled
by default.

## Analyze test results

You can use our [HTTP Tests Analyzer Jupiter Notebook](https://github.com/KiweeEu/http3-test-results). 
The script aggregates network timings from the given directory containing HAR files.
Copy over the `data/*` contents, update the `path` parameter for the `show_results` function call and run the script.

## Additional environment variables

| Variable              | Description                                           |
|-----------------------|-------------------------------------------------------|
| `BASIC_AUTH_USERNAME` | If testing website requires basic auth - the username |
| `BASIC_AUTH_PASSWORD` | Basic auth password                                   |

Example:
```shell
docker run -i --init --cap-add=SYS_ADMIN --rm -v $(pwd)/data/http2:/home/pptruser/output \
  TEST_PAGE_URL=https://www.google.com httptest \
  -e BASIC_AUTH_USERNAME=username -e BASIC_AUTH_PASSWORD=password \
  node test.js --disable-quic
```
