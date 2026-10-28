Development

19 sept 2026

Day 1: Problem Scope, Workstation Curation & Architecture Design

- **Progress:**

- **Workstation Selection:** Selection of a list of computer systems meeting minimum technical specifications based on defined user profiles.

- **Profile Selection:** Selection of professional roles where computer performance is fundamental to the work and directly impacts productivity. The profiles targeted by this software include: 3D Animators, Video Editors, Motion Graphics Artists, and Streamers.

- **Specification Research:** Official technical reference manuals and hardware specification sheets were gathered to identify limits regarding expansion slots, PCIe specifications, drive bays, and power supply wattage.

- **JSON Object Schemas:** I created JSON objects containing the technical specifications for several computers, sourcing the information from user manuals. I also created the TypeScript interface and the Mongoose schema to define the data structure.

- **Challenges and Solutions:**
- _Challenge:_ Determining the optimal application architecture that balances diagnostic processing speed with low maintenance requirements.

- _Challenge:_ Start the server with TypeScript. I solved it by running the command

Day 2

- **Engine architecture and rules :** I designed TypeScript code based on conditional logic that evaluates rules to determine equipment upgrade compatibility and generates appropriate upgrade recommendations for each scenario.This implementation follows a test-driven development (TDD) approach using Jest

      * Power.rule.test.ts

- _Challenge:_ Learn Jest how is the structure to make a test
- _Challenge:_ Fixing string format discrepancies and typos between test assertions and warning messages during Jest test-driven development cycles for ram.rule.ts

Day 3

- **Schema profileRequirement.model.ts :**
- **optimazedProfile Schema / opptimazedProfile.model.ts:**
