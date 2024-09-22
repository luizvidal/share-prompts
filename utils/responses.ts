export const notFoundErrorResponse = (resource = "Prompt") =>
	new Response(`${resource} not found`, { status: 404 });

export const serverErrorResponse = () =>
	new Response("Internal Server Error", { status: 500 });

export const successResponse = (res: string | object, status = 200) =>
	new Response(JSON.stringify(res), { status });

export const successDeleteResponse = (resource = "Prompt") =>
	new Response(`${resource} deleted successfully`, { status: 200 });
