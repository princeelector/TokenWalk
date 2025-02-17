export type User = {
	name?: string
	url?: string
	bio?: string
	location?: string
	email?: string
	website?: string
	twitter?: string
	instagram?: string
	profileImage?: string
	headerImage?: string
}

export type UserWithAccount = User & {account: string}
