import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client/core'
import fetch from 'cross-fetch'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.hyperlane.xyz/v1/graphql', fetch }),
  cache: new InMemoryCache(),
})

const GET_MESSAGE_STATUS = gql`
  query GetMessageStatus($msgId: bytea!) {
    message_view(limit: 10, where: { msg_id: { _eq: $msgId } }) {
      is_delivered
      msg_id
    }
  }
`

// Function to fetch message status
async function fetchMessageStatus(msgId: string) {
  try {
    const response = await client.query({
      query: GET_MESSAGE_STATUS,
      variables: { msgId },
    })

    const message = response.data.message_view[0]
    if (message) {
      console.log(`Message delivered: ${message.is_delivered}`)
    } else {
      console.log('Message not found.')
    }
  } catch (error) {
    console.error('Error fetching message status:', error)
  }
}

// Replace messageId with the actual message ID
const messageId =
  '0x119e1de46f8d5e6512dc0f1dba9d950118c8a68f9286b25e87677d38e4ae7024'
fetchMessageStatus(messageId)
