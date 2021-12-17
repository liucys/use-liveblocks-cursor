import React, { useEffect } from "react";
import { Colors } from "./utils";
import Cursor from "./Cursor";
import { createClient } from "@liveblocks/client";
import {
  LiveblocksProvider,
  RoomProvider,
  useOthers,
  useMyPresence,
} from "@liveblocks/react";
import "./App.css";

const client = createClient({
  publicApiKey: "pk_live_c3gZnzMKV5jesGqHMwrtQtBU",
});

function ConnectionInfo() {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  useEffect(() => {
    const handlePinterMove = (e) => {
      const cursor = {
        x: e.clientX,
        y: e.clientY,
      };
      updateMyPresence({ cursor });
    };
    const handlePointerLeave = () => {
      updateMyPresence({ cursor: null });
    };
    document.body.addEventListener("pointermove", handlePinterMove, false);
    document.body.addEventListener("pointerleave", handlePointerLeave, false);
  }, []);

  return (
    <>
      {myPresence && myPresence.cursor && (
        <Cursor
          x={myPresence.cursor.x}
          y={myPresence.cursor.y}
          color={Colors[0]}
        />
      )}
      {others.count === 0
        ? "You’re the only one here."
        : others.count === 1
        ? "There is one other person here."
        : `There are ${others.count}  other people here.`}
      {others.map(({ connectionId, presence }) => {
        if (presence == null || presence.cursor == null) {
          return null;
        }
        return (
          <Cursor
            key={connectionId}
            x={presence.cursor.x}
            y={presence.cursor.y}
            color={Colors[connectionId % Colors.length]}
          />
        );
      })}
    </>
  );
}

function App() {
  return (
    <LiveblocksProvider client={client}>
      <RoomProvider
        id="react-cursor-001"
        defaultPresence={() => ({ cursor: { x: 10, y: 10 } })}
      >
        <div className="App">
          <header className="App-header">
            <div>Multi-player mouse</div>
            <ConnectionInfo />
          </header>
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

export default App;
