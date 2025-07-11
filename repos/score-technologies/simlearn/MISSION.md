
### Goal: train deep learning models on /data 

# Training notes

- Use pytorch
- We want to create deep learning models that predict the outcome column
- Data looks like this: 

ball_x,ball_y,ball_vx,ball_vy,team1_0_x,team1_0_y,team1_1_x,team1_1_y,team1_2_x,team1_2_y,team1_3_x,team1_3_y,team1_4_x,team1_4_y,team2_0_x,team2_0_y,team2_1_x,team2_1_y,team2_2_x,team2_2_y,team2_3_x,team2_3_y,team2_4_x,team2_4_y,outcome
50.0,30.0,0.0,0.0,20.0,30.0,20.0,5.0,35.0,20.0,35.0,40.0,20.0,55.0,80.0,30.0,80.0,5.0,65.0,20.0,65.0,40.0,80.0,55.0,-1
50.0,30.0,0.0,0.0,19.667500000000032,30.0,20.311573171590563,5.115136529654038,35.82702449872065,20.511744125651756,35.3295727233711,40.04130017989131,20.144237794873227,54.70043072411555,80.33249999999997,30.0,79.85676467450423,5.300045422775416,64.66975466985095,19.96671084215222,64.2045445067162,39.52651931646127,79.6889079622623,54.88368749441214,-1
50.0,30.0,0.0,0.0,18.56500000000014,30.0,21.338541464417233,5.512207767417843,38.336321831887325,21.93905385867254,36.42343209989243,40.16301208494288,20.627508393390833,53.70958505466096,81.43499999999986,30.0,79.37361701494649,6.2909744351874775,63.57485439575743,19.856823587621196,61.568601511553524,37.946889411160015,78.66805292475476,54.47011381624051,-1
5

### Geometry

The coordinates for the field are (0,100) x (0,60)

### Regressors

X = ball_x,ball_y,ball_vx,ball_vy,team1_0_x,team1_0_y,team1_1_x,team1_1_y,team1_2_x,team1_2_y,team1_3_x,team1_3_y,team1_4_x,team1_4_y,team2_0_x,team2_0_y,team2_1_x,team2_1_y,team2_2_x,team2_2_y,team2_3_x,team2_3_y,team2_4_x,team2_4_y

## Target

y = outcome


### Reflection symmetry 1  

     1. Replace values `y` in all columns ending in _y with the value `60-y` 
     2. Replace values `vy` in all columns ending in _vy with -vy 

### Reflection anti-symmetry 2 

    1. Replace values `x` in all columns ending in _x with the value 100-x 
    2. Replace values `vx` in all columns ending in _vx with the value -vx

Call that s2(X)

    3. Replace values `o` in the outcome column with `-o`

### Perturbation symmetry (approx)

    1. Permute players on team1 in any fashion (e.g. interchange the values inn columns starting with team1_3_ with the corresponding ones in team1_2_ etc)

Call this s3(X)

The function we wish to learn f(X) = y should satisfy  f(s1(X)) = f(s(X)) = f(X) = -f(s2(X))  


### Epochs and lookahead

It might make sense to first train a simple model based only on ball_x and ball_y

There are break points in the data regularly where the game resets after a goal. These define epochs that are easily detected. It is possible, therefore, to create auxiliary targets for training that are future values of a simple model, such as the one above. Just an idea. By training the model to predict some weighted combination of auxiliary targets and the real one, it might learn faster. 



### Structure of project

/data  -  all data 

/simlearn/something
/simlearn/something_else   -  utilities 
/simlearn/approaches/mydumbidea - code for training

/outputs/mydumbidea - artefacts 


