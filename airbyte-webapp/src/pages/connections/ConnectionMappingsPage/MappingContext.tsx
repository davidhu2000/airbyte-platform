import React, { PropsWithChildren, createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useCurrentConnection } from "core/api";
import { ConfiguredStreamMapper, StreamMapperType } from "core/api/types/AirbyteClient";

import { useGetMappingsForCurrentConnection } from "./useGetMappingsForCurrentConnection";
import { useUpdateMappingsForCurrentConnection } from "./useUpdateMappingsForCurrentConnection";

interface MappingContextType {
  streamsWithMappings: Record<string, ConfiguredStreamMapper[]>;
  updateLocalMapping: (streamName: string, updatedMapping: ConfiguredStreamMapper) => void;
  reorderMappings: (streamName: string, newOrder: ConfiguredStreamMapper[]) => void;
  clear: () => void;
  submitMappings: () => Promise<void>;
  removeMapping: (streamName: string, mappingId: string) => void;
  addStreamToMappingsList: (streamName: string) => void;
  addMappingForStream: (streamName: string) => void;
  validateMappings: () => void;
}

const MappingContext = createContext<MappingContextType | undefined>(undefined);

export const MappingContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const connection = useCurrentConnection();
  const savedStreamsWithMappings = useGetMappingsForCurrentConnection();
  const { updateMappings } = useUpdateMappingsForCurrentConnection(connection.connectionId);
  const [streamsWithMappings, setStreamsWithMappings] = useState(savedStreamsWithMappings);

  const validateMappings = () => {
    console.log(`validateMappings`, streamsWithMappings);
    // TOOD: actually validate mappings via the API :-)
  };

  // Updates a specific mapping in the local state
  const updateLocalMapping = (streamName: string, updatedMapping: ConfiguredStreamMapper) => {
    console.log(`updating local mapping for stream ${streamName}`, updatedMapping);
    setStreamsWithMappings((prevMappings) => ({
      ...prevMappings,
      [streamName]: prevMappings[streamName].map((mapping) =>
        mapping.mapperConfiguration.id === updatedMapping.mapperConfiguration.id ? updatedMapping : mapping
      ),
    }));
  };

  const addMappingForStream = (streamName: string) => {
    setStreamsWithMappings((prevMappings) => ({
      ...prevMappings,
      [streamName]: [
        ...prevMappings[streamName],
        { type: StreamMapperType.hashing, mapperConfiguration: { id: uuidv4() } },
      ],
    }));
  };

  // Reorders the mappings for a specific stream
  const reorderMappings = (streamName: string, newOrder: ConfiguredStreamMapper[]) => {
    setStreamsWithMappings((prevMappings) => ({
      ...prevMappings,
      [streamName]: newOrder,
    }));
  };

  // Clears the mappings back to the saved state
  const clear = () => {
    setStreamsWithMappings(savedStreamsWithMappings);
  };

  const removeMapping = (streamName: string, mappingId: string) => {
    const mappingsForStream = streamsWithMappings[streamName].filter(
      (mapping) => mapping.mapperConfiguration.id !== mappingId
    );

    setStreamsWithMappings((prevMappings) => {
      if (mappingsForStream.length === 0) {
        const { [streamName]: removedStream, ...rest } = prevMappings;
        return rest;
      }
      return {
        ...prevMappings,
        [streamName]: mappingsForStream,
      };
    });
  };

  // Submits the current mappings state to the backend
  const submitMappings = async () => {
    await updateMappings(streamsWithMappings);
    return Promise.resolve();
  };

  const addStreamToMappingsList = (streamName: string) => {
    const newMapping: Record<string, ConfiguredStreamMapper[]> = {
      [streamName]: [{ type: StreamMapperType.hashing, mapperConfiguration: { id: uuidv4() } }],
    };
    setStreamsWithMappings((prevMappings) => ({
      ...prevMappings,
      ...newMapping,
    }));
  };

  return (
    <MappingContext.Provider
      value={{
        streamsWithMappings,
        updateLocalMapping,
        reorderMappings,
        clear,
        submitMappings,
        removeMapping,
        addStreamToMappingsList,
        addMappingForStream,
        validateMappings,
      }}
    >
      {children}
    </MappingContext.Provider>
  );
};

export const useMappingContext = () => {
  const context = useContext(MappingContext);
  if (!context) {
    throw new Error("useMappingContext must be used within a MappingContextProvider");
  }
  return context;
};
