import React, { Fragment, createRef, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Image, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useDispatch, useSelector } from 'react-redux';
import { updateComponentRectanglePosition } from '../utils/reducers/designSliceV2';

export default function KonvaStage({ userImage, selectedIdx, setSelectedIdx }) {
  const [image] = useImage(userImage);

  // redux state
  const components = useSelector((state) => state.designV2.components);
  const rectangles = components.map((item) => item.rectangle);
  const dispatch = useDispatch();

  // refs and other state
  // creating a ref object. object has a property called '.current' and the value of this property is persisted across renders. it will reference a konva Transformer component
  const trRef = useRef();
  const rectRefs = useRef([]);

  useEffect(() => {
    rectRefs.current = rectRefs.current.slice(0, components.length);
  }, [components]);

  useEffect(() => {
    if (selectedIdx !== null && trRef.current) {
      // Use the ref of the selected rectangle
      const selectedRectRef = rectRefs.current[selectedIdx];
      if (selectedRectRef) {
        trRef.current.nodes([selectedRectRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedIdx, components]);

  // event handlers
  function handleRectClick(e, componentId) {
    // prevent stage from deselecting the shape
    e.cancelBubble = true;
    const clickedIdx = components.findIndex((item) => item._id === componentId);
    setSelectedIdx(clickedIdx);
  }

  // handle drag and transform
  function handleChangeEnd(componentId, attrs) {
    const { x, y, width, height } = attrs;
    const body = { x, y, width, height };
    dispatch(updateComponentRectanglePosition({ componentId, body }));
  }

  if (image) {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Image
            image={image}
            width={Number(components[0].rectangle.width)}
            height={Number(components[0].rectangle.height)}
          />
          {rectangles.map((rect, i) => {
            if (!rectRefs.current[i]) rectRefs.current[i] = createRef();
            const { component_id } = rect;
            return (
              <Fragment key={component_id}>
                <Rect
                  ref={rectRefs.current[i]}
                  x={Number(rect.x_position)}
                  y={Number(rect.y_position)}
                  width={Number(rect.width)}
                  height={Number(rect.height)}
                  stroke={rect.stroke}
                  strokeScaleEnabled={false}
                  draggable={
                    components.findIndex((c) => c._id === component_id) > 0
                  }
                  strokeWidth={Number(rect.borderwidth)}
                  onClick={(e) => handleRectClick(e, component_id)}
                  fill={rect.backgroundcolor}
                  cornerRadius={Number(rect.borderradius)}
                  onDragEnd={(e) =>
                    handleChangeEnd(component_id, e.target.attrs)
                  }
                  onTransformEnd={(e) => {
                    // Get the shape
                    const shape = e.target;

                    // Calculate new size
                    const newWidth = shape.width() * shape.scaleX();
                    const newHeight = shape.height() * shape.scaleY();

                    // Update shape properties
                    shape.width(newWidth);
                    shape.height(newHeight);
                    shape.scaleX(1);
                    shape.scaleY(1);

                    // Update the state or handle the change as needed
                    handleChangeEnd(component_id, {
                      ...shape.attrs,
                      width: newWidth,
                      height: newHeight,
                    });
                  }}
                />
                {selectedIdx > 0 &&
                  components[selectedIdx]._id === component_id && (
                    <Transformer ref={trRef} rotateEnabled={false} />
                  )}
              </Fragment>
            );
          })}
        </Layer>
      </Stage>
    );
  }
}
