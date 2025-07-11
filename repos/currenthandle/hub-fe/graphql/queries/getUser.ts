export default `query getUser($id: String!){
	user(id: $id) {
		id
		username
		avatarUrl
		createdAt
	}
}`