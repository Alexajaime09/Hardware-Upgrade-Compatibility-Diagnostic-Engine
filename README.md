Development

19 sept 2026

Day 1: Problem Scope, Workstation Curation & Architecture Design

- **Progress:**

- **Workstation Selection:** Selection of a list of computer systems meeting minimum technical specifications based on defined user profiles.

- **Profile Selection:** Selection of professional roles where computer performance is fundamental to the work and directly impacts productivity. The profiles targeted by this software include: 3D Animators, Video Editors, Motion Graphics Artists, and Streamers.

- **Specification Research:** Official technical reference manuals and hardware specification sheets were gathered to identify limits regarding expansion slots, PCIe specifications, drive bays, and power supply wattage.

- **JSON Object Schemas:** I created structured JSON models in `datos/sistemas/` and `datos/componentes/` to store detailed hardware specifications (CPU, GPU, RAM, storage) for automated diagnostic analysis.

- **Challenges and Solutions:**
- _Challenge:_ Determining the optimal application architecture that balances diagnostic processing speed with low maintenance requirements.
