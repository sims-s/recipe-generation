import numpy as np
try:
    import pickle5 as pickle
except ImportError:
    import pickle

with open('processedv4.pkl', 'rb') as f:
    full_df = pickle.load(f)

def make_modeling_data(row):
    

full_df = full_df.apply(make_modeling_data, axis=1)

np.random.seed(42)
sample_df = full_df
train_indexer = np.random.rand(sample_df.shape[0]) < .995
train_df = sample_df[train_indexer]
test_df = sample_df[~train_indexer]

train_df[['text']].to_csv('train_txt.csv')
test_df[['text']].to_csv('test_txt.csv')