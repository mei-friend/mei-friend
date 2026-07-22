bind = "0.0.0.0:7677"
workers = 2
# Threaded workers: /proxy relays all GitHub API and git traffic, so requests
# are I/O-bound and hold a worker for the full upstream round-trip. gthread
# also moves the worker timeout watchdog off individual requests, so large
# clone transfers are no longer killed at `timeout` seconds.
worker_class = "gthread"
threads = 8
# Ceiling for a genuinely hung worker. The default is 30s, which a large repo
# clone can exceed just streaming the ~40-50MB pack back through /proxy to a
# slow client: a sync worker blocked in sock.sendall() past 30s gets killed
# mid-transfer, truncating the clone. gthread keeps long transfers off the
# timeout watchdog; this generous value out of abundance of caution.
timeout = 120
