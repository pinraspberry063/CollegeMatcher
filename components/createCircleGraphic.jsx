const doCirclesOverlap = (circle1, circle2) => {
    const dx = circle1.cx - circle2.cx;
    const dy = circle1.cy - circle2.cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const combinedRadii = circle1.r + circle2.r + 6;
    return distance < combinedRadii;
  };
  
  export const generateCircleData = (stof) => {
    const data = [];
    const Xmin = 145;
    const Xmax = 350;
    const Ymin = 20;
    const Ymax = stof*10;
    const radius = 15; // Radius of the circles
    const gridCellSize = (radius * 2) + 6; // Slightly larger than diameter to handle overlaps
  
    const grid = {}; // Object to store circles in grid cells
  
    const getGridKey = (cx, cy) => {
      const gridX = Math.floor(cx / gridCellSize);
      const gridY = Math.floor(cy / gridCellSize);
      return `${gridX},${gridY}`;
    };
  
    while (data.length < stof) {
      const newCircle = {
        cx: Math.random() * (Xmax - Xmin) + Xmin,
        cy: Math.random() * (Ymax - Ymin) + Ymin,
        r: radius,
      };
  
      const gridKey = getGridKey(newCircle.cx, newCircle.cy);
      const neighbors = [];
  
      // Check nearby grid cells for overlapping circles
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const neighborKey = `${parseInt(gridKey.split(',')[0]) + dx},${parseInt(gridKey.split(',')[1]) + dy}`;
          if (grid[neighborKey]) {
            neighbors.push(...grid[neighborKey]);
          }
        }
      }
  
      // Check for overlaps only with circles in nearby grid cells
      let overlap = false;
      for (let i = 0; i < neighbors.length; i++) {
        if (doCirclesOverlap(newCircle, neighbors[i])) {
          overlap = true;
          break;
        }
      }
  
      // Add the circle if no overlap was detected
      if (!overlap) {
        data.push(newCircle);
        // Add the circle to the grid
        if (!grid[gridKey]) {
          grid[gridKey] = [];
        }
        grid[gridKey].push(newCircle);
      }
    }
  
    return data;
  };
  