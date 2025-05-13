import random
import pandas as pd

def generate_human_typing(num_samples, min_intervals=3, max_intervals=600):
    human_data = []
    for _ in range(num_samples):
        num_intervals = random.randint(min_intervals, max_intervals)
        base_speed = random.randint(30, 70)
        wpm_intervals = [base_speed + random.randint(-5, 5) for _ in range(num_intervals)]  
        human_data.append(wpm_intervals)
    return human_data

def generate_bot_typing(num_samples, min_intervals=3, max_intervals=600):
    bot_data = []
    for _ in range(num_samples):
        num_intervals = random.randint(min_intervals, max_intervals)
        base_speed = random.randint(50, 70)
        wpm_intervals = [base_speed + random.randint(-1, 1) for _ in range(num_intervals)]  
        bot_data.append(wpm_intervals)
    return bot_data

def generate_dataset(num_human_samples, num_bot_samples):
    human_data = generate_human_typing(num_human_samples)
    bot_data = generate_bot_typing(num_bot_samples)
    
    data = human_data + bot_data
    labels = [0] * num_human_samples + [1] * num_bot_samples
    
    combined = list(zip(data, labels))
    random.shuffle(combined)
    data, labels = zip(*combined)
    
    return list(data), list(labels)

def save_dataset_to_csv(data, labels, filename="typing_data_high_variance.csv"):
    dataset = {"WPM Intervals": [" ".join(map(str, d)) for d in data], "Label": labels}
    df = pd.DataFrame(dataset)
    df.to_csv(filename, index=False)
    print(f"Dataset saved to {filename}")

num_human_samples = 5000
num_bot_samples = 5000
data, labels = generate_dataset(num_human_samples, num_bot_samples)

save_dataset_to_csv(data, labels)

for i in range(10):
    print(f"Sample {i + 1}: {data[i]} (Label: {'Human' if labels[i] == 0 else 'Bot'})")
