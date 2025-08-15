import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import CategoriesApi from '@/services/api/categories'
import SecSubCategoriesApi from '@/services/api/sec-sub-categories'
import SubCategoriesApi from '@/services/api/sub-categories'

// ✅ Category Hook
export const useCategory = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['categories'],
        queryFn: () => CategoriesApi.getAll(),
    })


    const categories = useMemo(
        () =>
            (data?.data?.data || []).map((item: any) => ({
                label: item.name,
                value: item.id
            })),
        [data]
    )

    return { categories, isLoading, isError, refetch }
}

// ✅ SubCategory Hook
export const useSubCategory = (categoryId?: number|string) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['subcategories', categoryId],
        queryFn: () => CategoriesApi.getSubCategories({ categoryId }),
    
    })

    const subCategories = useMemo(
        () =>
            (data?.data?.data || []).map((item: any) => ({
                label: item.name,
                value: item.id
            })),
        [data]
    )

    return { subCategories, isLoading, isError, refetch }
}

// ✅ Secondary SubCategory Hook
export const useSecSubCategory = (subCategoryId?: number) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['secSubCategories', subCategoryId],
        queryFn: () => SubCategoriesApi.getSecSubCategories({ subCategoryId }),
        enabled: !!subCategoryId, // only run when subCategoryId is provided
    })

    const secSubCategories = useMemo(
        () =>
            (data?.data?.data || []).map((item: any) => ({
                label: item.name,
                value: item.id
            })),
        [data]
    )

    return { secSubCategories, isLoading, isError, refetch }
}
