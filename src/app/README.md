# RAG Visualization - Component Structure

## Overview
The RAG visualization has been refactored into modular components for easy editing and feature additions.

## File Structure
```
src/app/
├── page.tsx                    # Main page (now clean and simple)
├── visualization.module.css    # All styling
├── data/
│   └── nodes.ts               # Node data and configuration
├── components/
│   ├── Node.tsx               # Reusable node component
│   └── Connectors.tsx         # SVG connections and arrows
└── README.md                  # This file
```

## How to Edit

### Adding/Editing Node Content
1. Open `data/nodes.ts`
2. Find the node you want to edit
3. Modify the `label` or `content` fields
4. Changes will automatically reflect on the page

### Adding New Nodes
1. Add a new object to the `nodes` array in `data/nodes.ts`
2. Include: `id`, `label`, `content`, and `position`
3. The node will automatically render

### Modifying Connections
1. Open `components/Connectors.tsx`
2. Add/modify SVG path elements
3. Update coordinates to match your new nodes

### Adding Features to Nodes
1. Edit `components/Node.tsx` to add new functionality
2. Modify the `NodeData` interface in `data/nodes.ts` if needed
3. All nodes will inherit the new features

### Styling Changes
1. All styles are in `visualization.module.css`
2. Use CSS variables for consistent theming
3. Hover effects and animations are already implemented

## Benefits of This Structure
- **Easy Content Updates**: Just edit the data file
- **Reusable Components**: Add features once, apply everywhere
- **Maintainable**: Clear separation of concerns
- **Scalable**: Easy to add new node types or features
- **Type Safety**: TypeScript interfaces prevent errors