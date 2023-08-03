import { useState } from "react";
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { StrictModeDroppable as Droppable } from './DragAndDropStrict'
import './App.css'

// TODO: Fix bug with insertion of single product in group

const DATA = [
  {
    id: "0e2f0db1-5457-46b0-949e-8032d2f9997a",
    name: "To Do",
    items: [
      { id: "26fd50b3-3841-496e-8b32-73636f6f4197", name: "Lorem" },
      { id: "b0ee9d50-d0a6-46f8-96e3-7f3f0f9a2525", name: "Ipsum" },
    ],
    tint: 1,
  },
  {
    id: "487f68b4-1746-438c-920e-d67b7df46247",
    name: "In Progress",
    items: [
      {
        id: "95ee6a5d-f927-4579-8c15-2b4eb86210ae",
        name: "Designing Data Intensive Applications",
      },
      { id: "5bee94eb-6bde-4411-b438-1c37fa6af364", name: "Dolor sit" },
    ],
    tint: 2,
  },
  {
    id: "25daffdc-aae0-4d73-bd31-43f73101e7c0",
    name: "Done",
    items: [
      { id: "960cbbcf-89a0-4d79-aa8e-56abbc15eacc", name: "Ament" },
      { id: "d3edf796-6449-4931-a777-ff66965a025b", name: "Consectetur adipiscing" },
    ],
    tint: 3,
  },
];


function App() {

  const [stores, setStores] = useState(DATA);

  const handleDragAndDrop = (results) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedStores = [...stores];

      const storeSourceIndex = source.index;
      const storeDestinatonIndex = destination.index;

      const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
      reorderedStores.splice(storeDestinatonIndex, 0, removedStore);

      return setStores(reorderedStores);
    }
    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;

    const storeSourceIndex = stores.findIndex(
      (store) => store.id === source.droppableId
    );
    const storeDestinationIndex = stores.findIndex(
      (store) => store.id === destination.droppableId
    );

    const newSourceItems = [...stores[storeSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...stores[storeDestinationIndex].items]
        : newSourceItems;

    const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
    newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

    const newStores = [...stores];

    newStores[storeSourceIndex] = {
      ...stores[storeSourceIndex],
      items: newSourceItems,
    };
    newStores[storeDestinationIndex] = {
      ...stores[storeDestinationIndex],
      items: newDestinationItems,
    };

    setStores(newStores);
  };

  return (
    <div className="wrapper">
      <DragDropContext onDragEnd={handleDragAndDrop}>
        
        <div >
          {stores.map((store, index) => (
            <div className="group" key={index}>
              {/* <h3>{store.name}</h3> */}
              <StoreList {...store} />
            </div>
          ))}
        </div>
      
      </DragDropContext>
    </div>
  )
}

interface Props {
  name: string,
  items: string[],
  id: string
}

function StoreList({ name, items, id }: Props) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div{...provided.droppableProps} ref={provided.innerRef}>

          <div >
            <h3>{name}</h3>
          </div>

          <div>
            {items.map((item: any, index: number) => (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided) => (
                  <div
                    className="element"
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                  >
                    <h4>{item.name}</h4>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default App
