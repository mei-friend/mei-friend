bind = "0.0.0.0:7877"
workers = 2
# Threaded workers: /proxy relays all GitHub API and git traffic, so requests
# are I/O-bound and hold a worker for the full upstream round-trip. gthread
# also moves the worker timeout watchdog off individual requests, so large
# clone transfers are no longer killed at `timeout` seconds.
worker_class = "gthread"
threads = 8
