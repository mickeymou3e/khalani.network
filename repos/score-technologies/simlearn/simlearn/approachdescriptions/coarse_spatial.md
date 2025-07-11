## Key Spatial Logic in `CoarseSpatial`

### 🔹 Defensive Pressure (`_calculate_defensive_pressure`)

**Purpose:**  
Measures whether a team is exerting pressure on the ball *near their own goal*.

**Logic:**
- For each batch element:
  - Compute the **distance from the ball to each team's goal**:
    - Team 1's goal: `(0, 30)`
    - Team 2's goal: `(100, 30)`
  - Compute **minimum distance from each team's players to the ball**.
  - A team is considered to be applying pressure if:
    - At least one player is within `10` units of the ball **AND**
    - The ball is within `30` units of that team's goal.
- Output values:
  - `+1` if Team 1 is applying pressure near their own goal.
  - `-1` if Team 2 is applying pressure near their own goal.
  - `0` otherwise.

**Usage in forward pass:**
```python
defensive_pressure.unsqueeze(1).unsqueeze(2).expand(-1, *self.grid_size)
```
— Broadcasts the scalar pressure value across the spatial grid as a feature map.

### 🔹 Defensive Triangles (`_is_point_in_triangle`)

**Purpose:**  
Defines defensive zones as triangles between the ball and goals.

**Logic:**
- For each point on the grid:
  - Creates a triangle between:
    1. The ball position
    2. The defending goal
    3. The point being checked
  - Angle between ball-goal and ball-point vectors is computed
  - Point is considered in defensive zone if angle ≤ 45° (π/4 radians)
- Used to identify areas where:
  - Team 1 defends the right goal (100, 30)
  - Team 2 defends the left goal (0, 30)
- Helps model understand defensive positioning and coverage

---

### 🔹 Possession Indicator (`_calculate_possession_indicator`)

**Purpose:**  
Indicates which team is likely to have possession *only when the ball is moving slowly*.

**Logic:**
- If `ball_speed < 2.0`:
  - Compare the closest player from each team to the ball.
  - Assign:
    - `+1` → Team 1 closer
    - `-1` → Team 2 closer
- Else → `0` (no reliable possession)

Used to create a **possession map** weighted by ball influence.

---

### 🔹 Anticipated Ball Position

Predicts where the ball is going next using velocity decay:
```python
anticipated_ball_pos = ball_pos + ((1 - exp(-friction * delta_t)) / (friction + ε)) * ball_vel
```
- Models exponential decay due to **friction**.
- Influence maps are computed at both current and anticipated positions.
- Ball influence = average of both maps.

---

### 🔹 Team Influence Maps

For each player:
- Place a 2D Gaussian on the grid centered at their location.
- Width controlled by `sigma`.
- Sum across all players to get the **team's influence map**.

---

### 🔹 Possession Maps

- Multiply each **team influence map** by the **ball influence map**.
- Produces spatial maps showing where each team is likely to control the ball.

---

### 🔹 Goal Importance Weighting

- Static map emphasizing areas near goals:
  - Constructed using Gaussians centered at `(0, 30)` and `(100, 30)` with `sigma=15`.
- Used to **weight all influence and possession maps**:
  - Encourages model to focus on spatial features near goal areas.
