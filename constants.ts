
import { Chapter } from './types';

export const TEXTBOOK_CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    title: '1. Fundamentals of Humanoid Design',
    description: 'Introduction to anthropomorphic morphology and mechanical constraints.',
    topics: ['Degrees of Freedom (DoF)', 'Mass Distribution', 'Actuation Principles'],
    content: `Humanoid robotics is the study of systems that mimic the human form. Unlike industrial robots, humanoids must navigate unstructured environments while maintaining balance. 
    
    The primary challenge is managing the high center of mass relative to a small support polygon (the feet). We typically model these systems as branched kinematic chains with 20 to 50 degrees of freedom. Key design considerations include power-to-weight ratio and structural stiffness vs. compliant actuation.`
  },
  {
    id: 'kinematics',
    title: '2. Forward & Inverse Kinematics',
    description: 'Mathematical modeling of joint configurations and end-effector positions.',
    topics: ['Denavit-Hartenberg Parameters', 'Jacobian Matrices', 'Singularity Handling'],
    content: `Kinematics describes motion without considering forces. For a humanoid, we must define a root frame (usually the pelvis or the base of the support foot). 
    
    Forward Kinematics (FK) maps joint angles to Cartesian coordinates. Inverse Kinematics (IK) solves for joint angles given a desired hand or foot position. Because humanoids are redundant, multiple configurations can reach the same point, requiring optimization techniques like Jacobian Pseudo-inverse or Quadratic Programming (QP).`
  },
  {
    id: 'dynamics',
    title: '3. Dynamics & Balance Control',
    description: 'Forces, torques, and the physics of bipedal locomotion.',
    topics: ['Lagrange-Euler Formulation', 'Zero Moment Point (ZMP)', 'Centroidal Dynamics'],
    content: `Dynamics deals with the relationship between motion and its causes (forces/torques). The equations of motion for a humanoid are non-linear and highly coupled.
    
    Bipedal balance is often analyzed through the Zero Moment Point (ZMP). If the ZMP stays within the support polygon, the robot does not tip. Modern controllers use Model Predictive Control (MPC) to plan footsteps and body trajectories simultaneously.`
  },
  {
    id: 'sensing',
    title: '4. Perception & State Estimation',
    description: 'Sensory integration for environmental awareness and internal state.',
    topics: ['IMU Fusion', 'Force-Torque Sensors', 'Visual SLAM'],
    content: `A humanoid requires 'proprioception' (internal state) and 'exteroception' (external state). 
    
    State estimation combines IMU data (accelerometers and gyros) with joint encoders and foot-pressure sensors using Extended Kalman Filters (EKF). This creates a 'stable world' view for the controller, preventing falls due to sensor noise.`
  },
  {
    id: 'learning',
    title: '5. AI & Reinforcement Learning',
    description: 'The future of humanoid control through data-driven methods.',
    topics: ['Deep RL', 'Sim-to-Real Transfer', 'Behavioral Cloning'],
    content: `While classical control (MPC) is robust, it struggles with complex terrains and non-rigid environments. Reinforcement Learning (RL) allows robots to learn locomotion policies through trial and error in simulation.
    
    The 'Sim-to-Real' gap is the primary hurdle, requiring domain randomization and precise physics modeling to ensure that policies learned in a simulator work on physical hardware.`
  }
];
