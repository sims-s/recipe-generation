import numpy as np
try:
    import pickle5 as pickle
except ImportError:
    import pickle

with open('processedv4.pkl', 'rb') as f:
    full_df = pickle.load(f)

end_ingredients_token = '<END_ING>'
end_recipe_token = '<END_REC>'

def make_modeling_data(row):
  ingredients_joined = 'Ingredients: ' + ', '.join(row['ingredients'])
  instructions_joined = 'Instructions: '
  for i in range(len(row['instructions'])):
    instructions_joined += '%d. %s'%(i, row['instructions'][i])
  if np.random.rand() < .5:
    return row['title'] + ' ' + ingredients_joined + end_ingredients_token + instructions_joined + end_recipe_token
  else:
    return ingredients_joined + end_ingredients_token + instructions_joined + end_recipe_token

full_df['text'] = full_df.apply(make_modeling_data, axis=1)

np.random.seed(42)
sample_df = full_df
train_indexer = np.random.rand(sample_df.shape[0]) < .995
train_df = sample_df[train_indexer]
test_df = sample_df[~train_indexer]

train_df[['text']].to_csv('train_txt.csv')
test_df[['text']].to_csv('test_txt.csv')