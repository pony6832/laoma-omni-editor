"""讓 Windows 找得到 pip 安裝的 CUDA 函式庫（nvidia-cublas-cu12、nvidia-cudnn-cu12 放在 site-packages/nvidia/*/bin）。
轉錄與環境檢查在 import faster_whisper／ctranslate2 之前先呼叫 add_cuda_dll_dirs()，就不必手動改系統 PATH。"""
import glob, os, sys


def add_cuda_dll_dirs():
    added = []
    for sp in sys.path:
        for d in glob.glob(os.path.join(sp, "nvidia", "*", "bin")):
            if os.path.isdir(d) and d not in added:
                try:
                    os.add_dll_directory(d)
                except (AttributeError, OSError):
                    pass
                os.environ["PATH"] = d + os.pathsep + os.environ.get("PATH", "")
                added.append(d)
    return added
