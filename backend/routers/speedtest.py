from fastapi import APIRouter,WebSocket
import speedtest

router = APIRouter()

@router.get("/speedtest")
def get_speedtest_results():
    st = speedtest.Speedtest()
    st.get_best_server()
    ping = st.results.ping
    download_speed = st.download() / 10**6  # Convert to Mbps
    upload_speed = st.upload() / 10**6  # Convert to Mbps
    return {
        "ping": f"{ping:.2f} ms",
        "download_speed": f"{download_speed:.2f} Mbps",
        "upload_speed": f"{upload_speed:.2f} Mbps"
    }
