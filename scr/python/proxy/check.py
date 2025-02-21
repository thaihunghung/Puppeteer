import requests
import time

def check_proxy_latency(proxy_url, username, password, target_url):
  """Kiểm tra độ trễ của proxy có xác thực."""
  start_time = time.time()
  try:
    response = requests.get(
        target_url,
        proxies={"http": f"http://{username}:{password}@{proxy_url}"},
        timeout=10  # Thời gian chờ tối đa (giây)
    )
    response.raise_for_status()  # Kiểm tra lỗi HTTP
    end_time = time.time()
    latency = end_time - start_time
    print(f"Độ trễ của proxy: {latency:.2f} giây")
  except requests.exceptions.RequestException as e:
    print(f"Lỗi: {e}")

# Thông tin proxy
proxy_url = "45.249.106.95:5792"
username = "fnfbonxl"
password = "3u02c3h2w0n8"
target_url = "http://www.google.com"

check_proxy_latency(proxy_url, username, password, target_url)