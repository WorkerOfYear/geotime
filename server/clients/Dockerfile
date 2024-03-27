# Используем базовый образ с CUDA
FROM nvidia/cuda:11.5.0-devel

# Установка необходимых пакетов
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    cmake \
    git \
    libgtk2.0-dev \
    pkg-config \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    python3-dev \
    python3-numpy \
    libtbb2 \
    libtbb-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libdc1394-22-dev

# Клонирование репозитория OpenCV
RUN git clone https://github.com/opencv/opencv.git /opencv

# Клонирование репозитория OpenCV Contrib
RUN git clone https://github.com/opencv/opencv_contrib.git /opencv_contrib

# Установка OpenCV
RUN mkdir /opencv/build && \
    cd /opencv/build && \
    cmake -D CMAKE_BUILD_TYPE=RELEASE \
        -D CMAKE_INSTALL_PREFIX=/usr/local \
        -D WITH_CUDA=ON \
        -D ENABLE_FAST_MATH=1 \
        -D CUDA_FAST_MATH=1 \
        -D WITH_CUBLAS=1 \
        -D INSTALL_C_EXAMPLES=OFF \
        -D INSTALL_PYTHON_EXAMPLES=OFF \
        -D OPENCV_GENERATE_PKGCONFIG=ON \
        -D OPENCV_ENABLE_NONFREE=ON \
        -D OPENCV_EXTRA_MODULES_PATH=/opencv_contrib/modules .. && \
    make -j$(nproc) && \
    make install

# Очистка установочных файлов
RUN rm -rf /opencv /opencv_contrib

# Устанавливаем переменную окружения для библиотеки CUDA
ENV LD_LIBRARY_PATH=/usr/local/cuda/lib64:${LD_LIBRARY_PATH}

# Команда по умолчанию для запуска
CMD ["python", "model_manager.py"]
