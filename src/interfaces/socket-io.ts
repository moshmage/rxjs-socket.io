export interface IoEventInfo { name: string, count?: number; once?: boolean}
export interface SocketState { connected: boolean, id?: string; }
export const initialState: SocketState = {connected: false};
