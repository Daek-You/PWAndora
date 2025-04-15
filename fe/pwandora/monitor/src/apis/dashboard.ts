import { useQuery } from "@tanstack/react-query";
import _axios from "./_axios";

export function useDailyStats(day: number) {
    return useQuery({
        queryKey: ["stats", "daily", day],
        queryFn: () => _axios.get(`/monitor/stats?day=${day}`).then(res => res.data),
    })
}

export function useTotalStats() {
    return useQuery({
        queryKey: ["stats", "total"],
        queryFn: () => _axios.get('/monitor/stats/total').then(res => res.data),
        refetchInterval: 3000,
    })
}

export function useStackStats(day: number) {
    return useQuery({
        queryKey: ["stats", "stack", day],
        queryFn: () => _axios.get(`/monitor/stack/stats?day=${day}`).then(res => res.data),
    })
}


export function useCategoryCount() {
    return useQuery({
        queryKey: ["category", "count"],
        queryFn: () => _axios.get(`/monitor/category/count`).then(res => res.data),
    })
}
