import { Clients } from '../clients/index';
import { EventContext } from '@vtex/api';
import { COURSE_ENTITY } from '../utils/constants';

export async function updateLiveUsers(ctx: EventContext<Clients>) {
    const liveUserProducts = await ctx.clients.get_analytics().getLiveUsers();
    console.log("Live Users: ", liveUserProducts);
    await Promise.all(
        liveUserProducts.map(async ({ slug, liveUsers }) => {
            try {
                const [savedProduct] = await ctx.clients.masterdata.searchDocuments<{
                    id: string,
                    count: number,
                    slug: string
                }>({
                    dataEntity: COURSE_ENTITY,
                    fields: ['count', 'id', 'slug'],
                    pagination: {
                        page: 1,
                        pageSize: 1
                    },
                    schema: 'v1',
                    where: `slug=${slug}`
                });
                console.log("SAVED PRODUCT", savedProduct)
                await ctx.clients.masterdata.createOrUpdateEntireDocument({
                    dataEntity: COURSE_ENTITY,
                    fields: {
                        count: liveUsers,
                        slug
                    },
                    id: savedProduct?.id
                });
            } catch (e) {
                console.log(`Failed to update product ${slug}`);
                console.log(e);
            }
        })
    );
    return true
}