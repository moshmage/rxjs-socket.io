export interface IoEventInfo { name: string, count?: number; once?: boolean; initialState?:string|Object}
export interface SocketState { connected: boolean, id?: string; }
