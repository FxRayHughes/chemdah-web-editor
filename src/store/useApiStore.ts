import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_API_DATA } from './defaultApiData';

export interface ObjectiveField {
    name: string;
    pattern: string;
}

export interface ObjectiveDefinition {
    condition: ObjectiveField[];
    'condition-vars': string[];
    goal: ObjectiveField[];
    'goal-vars': string[];
}

export interface ApiDefinition {
    [group: string]: {
        [objective: string]: ObjectiveDefinition
    }
}

interface ApiState {
    apiData: ApiDefinition;
    loadApiData: () => Promise<void>;
    setApiData: (data: ApiDefinition) => void;
}

export const useApiStore = create<ApiState>()(
    persist(
        (set) => ({
            apiData: DEFAULT_API_DATA,
            loadApiData: async () => {
                try {
                    const response = await fetch('./api.json');
                    if (response.ok) {
                        const data = await response.json();
                        set({ apiData: data });
                        console.log('Loaded api.json');
                    } else {
                        console.warn('Failed to load api.json, using default data');
                    }
                } catch (error) {
                    console.warn('Error loading api.json', error);
                }
            },
            setApiData: (data) => set({ apiData: data }),
        }),
        {
            name: 'chemdah-api-storage',
        }
    )
);
