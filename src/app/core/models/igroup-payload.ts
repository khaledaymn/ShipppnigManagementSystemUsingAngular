export interface IGroupPayload {
    name: string;
    permissions: {
      id: number;
      values: number[];
    }[];
}
