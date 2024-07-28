import { Status } from "./Status"

export type Delivery = {
  id: string,  
  documento: string,
  motorista: {
    nome: string
  },
  cliente_origem: {
    nome: string,
    endereco: string,
    bairro: string,
    cidade: string
  },
  cliente_destino: {
    nome: string,
    endereco: string,
    bairro: string,
    cidade: string
  },
  status_entrega: Status
}