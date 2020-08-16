export async function analytics(ctx: Context, next: () => Promise<any>) {
  // const {
  //   clients: { analytics },
  // } = ctx
  
  if (ctx.method.toUpperCase() === 'GET') {
    ctx.status = 200
    ctx.body = await ctx.clients.get_analytics().getLiveUsers()
    ctx.set('cache-control', 'no-cache')
  }
  await next()
}
