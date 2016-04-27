# info474-data-exploration

## Rationale
### Data expression
The data set from the CDC contained rows of vaccine coverage data for each state which was processed by removing the uncertainty values for each percentage and saving the Excel file as a csv. There were three general variables that needed to be plotted - state, vaccines, and the percentage coverage for each vaccine. Since the vaccines and percentage coverage could be grouped by state, I chose to use a grouped bar chart to visualize this data set. A grouped bar chart utilizes the elementary perceptual task of position along a common scale, which ranks high in the hierarchy of perceptual tasks. This allows for quantitative information to be decoded more accurately than a divided bar chart, which would have utilized the perception of length. The coverage bars (each bar represents a vaccine coverage) per state is directly adjacent to each other to minimize the distance between the position comparisons. This proximity requires me to utilize color to separate the vaccines. The color scheme is kept consistent - whereupon vaccines keep the same color across states to provide visual consistency for the reader. To delimit between different states, horizontal spacing is used because this maintains the position comparison along a common scale while. To continue the theme of reducing complexity, there is a legend to represent which color corresponds to which vaccine. Finally, tooltips are added to provide additional interaction and accuracy by providing the actual vaccine coverage value.

### Control feature 1 - State selection


### Control feature 2 - Vaccine selection