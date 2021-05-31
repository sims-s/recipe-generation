#! /bin/sh

pip install requirements.txt
wget FILE_URL_EVENTUALLY
python process_data_clm.py
python process_data_span_corruption.py