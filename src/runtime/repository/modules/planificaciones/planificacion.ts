import type { $Fetch } from 'ofetch';
import type { IPlanificacion, IPlanificacionResponse } from '~/src/runtime/models/Planificacion';

export default class PlanificacionModule {
    constructor(private fetcher: $Fetch) {}

    async getAll(): Promise<IPlanificacionResponse[]> {
        return this.fetcher('/planificacion');
    }

    async getPlanificacionById(planificacionId: number): Promise<IPlanificacionResponse> {
        return this.fetcher(`/planificacion/${planificacionId}`);
    }

    async savePlanificacion(data: IPlanificacion): Promise<IPlanificacionResponse> {
        return this.fetcher('/planificacion', {
            method: 'POST',
            body: data
        })
    }

    async updatePlanificacion({data, id}: { data: IPlanificacion, id: number} ): Promise<IPlanificacionResponse> {
        return this.fetcher(`/planificacion/${id}`, {
            method: 'PUT',
            body: data
        })
    }

    async deleteTemporalPlanificacion(id: number): Promise<IPlanificacionResponse> {
        return this.fetcher(`/planificacion/${id}`)
    }

    async restorePlanificacion(id: number): Promise<IPlanificacionResponse> {
        return this.fetcher(`/planificacion/${id}/restore`)
    }

    async deletePlanificacion(id: number): Promise<IPlanificacionResponse> {
        return this.fetcher(`/planificacion/${id}`, {
            method: 'DELETE'
        })
    }

}
