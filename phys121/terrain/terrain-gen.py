import matplotlib.pyplot as plt
import numpy as np

x = np.array([
    0,
    3,
    6,
    9,
    12,
    15,
    18,
    21,
    24,
    27,
    30,
    33,
    36
])

y1 = np.array([
    8.4,
    5.2,
    3.4,
    2.2,
    1,
    0.5,
    0.3,
    0.4,
    0.7,
    1.4,
    2.6,
    4.4,
    6.8
])

y2 = np.array([
    9.2,
    5.6,
    3.7,
    2.2,
    1.2,
    0.7,
    0.5,
    0.5,
    0.9,
    1.5,
    2.8,
    4.2,
    6.7
])


lin_fit1 = np.polyfit(x, y1, 2)
lin_fit2 = np.polyfit(x, y2, 2)
lin_fit3 = (lin_fit1+lin_fit2)/2

x11 = np.linspace(np.min(x), np.max(x), 100)
y22 = lin_fit2 @ np.array([x11**2, x11, np.ones(100)])

plt.plot(x11, y22, color="black")

plt.xlim(0, 36)
plt.ylim(0, 36)

plt.axis('off')
plt.savefig("terrain-raw.svg", bbox_inches='tight')
# plt.show()
