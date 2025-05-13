import pandas as pd
import numpy as np

np.random.seed(42)
num_samples = 10000

tab_switches = np.random.randint(0, 20, size=num_samples)
window_focus_changes = np.random.randint(0, 15, size=num_samples)
copy_events = np.random.randint(0, 10, size=num_samples)
cut_events = np.random.randint(0, 10, size=num_samples)
paste_events = np.array([np.random.randint(0, max(1, copy_events[i] + cut_events[i] + 1)) for i in range(num_samples)])
full_screen_exits = np.random.randint(0, 5, size=num_samples)

risk_level = np.zeros(num_samples)

for i in range(num_samples):
    if tab_switches[i] == 0:
        risk_level[i] = 1
    else:
        risk_level[i] += 3 * tab_switches[i]
    if window_focus_changes[i] > 0:
        risk_level[i] += 3 * window_focus_changes[i]
    if full_screen_exits[i] > 0:
        risk_level[i] += 5 * full_screen_exits[i]
    if copy_events[i] > 0:
        risk_level[i] += 1.2 * copy_events[i]
    if cut_events[i] > 0:
        risk_level[i] += 1.2 * cut_events[i]
    if paste_events[i] > 0:
        risk_level[i] += 2 * paste_events[i]

    risk_level[i] += np.random.normal(0, 2)

risk_level = np.maximum(risk_level, 0)

data = pd.DataFrame({
    'Tab Switches': tab_switches,
    'Window Focus Changes': window_focus_changes,
    'Copy Events': copy_events,
    'Cut Events': cut_events,
    'Paste Events': paste_events,
    'Full Screen Exits': full_screen_exits,
    'Risk Level': risk_level
})

data.to_csv('cheating_risk_dataset_with_rules.csv', index=False)

print(data.head())