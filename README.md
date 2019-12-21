# Render path router

Conceptually new router, it utilizes idea of url serving as render path for react applications.

`/main/list/` translates into `<Main> <List/> <Main>`

## RouteAPI for react applications
Main path serves as render path, while query params serve as parameters for path

`/main/list?id=3&mainId=2`
becomes
```
<Main>
	<List/>
</Main>

$params:
{
	id: 3,
	mainId: 2
}
```