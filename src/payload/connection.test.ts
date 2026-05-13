import getPayloadClient from '@/payload/getPayload'
import type { Project, User, Media } from '@/types/payload-types'

/**
 * Tests the connection to the database via the Payload Local API.
 * Fetches a small number of documents from each collection to confirm functionality.
 */
async function testPayloadConnection() {
  console.log('Attempting to initialize Payload client...')
  try {
    const payload = await getPayloadClient()
    console.log('Payload client initialized successfully.')

    console.log('Attempting to fetch projects via Payload API...')
    const { docs: projectsData, totalDocs: totalProjects } =
      await payload.find<Project>({
        collection: 'projects',
        limit: 5, // Fetch a few projects
        depth: 0 // No need to populate relationships for a simple connection test
      })

    console.log(
      `Successfully fetched ${projectsData.length} projects (Total: ${totalProjects}).`
    )
    if (projectsData.length > 0) {
      console.log(
        'Sample project titles:',
        projectsData.map((p: Project) => p.title)
      )
    }

    // Add User Fetch
    console.log('\nAttempting to fetch users via Payload API...') // Add spacing
    const { docs: usersData, totalDocs: totalUsers } = await payload.find<User>(
      {
        collection: 'users',
        limit: 5,
        depth: 0
      }
    )

    console.log(
      `Successfully fetched ${usersData.length} users (Total: ${totalUsers}).`
    )
    if (usersData.length > 0) {
      console.log(
        'Sample user emails:',
        usersData.map((u: User) => u.email)
      )
    }

    // Add Media Fetch
    console.log('\nAttempting to fetch media via Payload API...') // Add spacing
    const { docs: mediaData, totalDocs: totalMedia } =
      await payload.find<Media>({
        collection: 'media',
        limit: 5,
        depth: 0
      })

    console.log(
      `Successfully fetched ${mediaData.length} media items (Total: ${totalMedia}).`
    )
    if (mediaData.length > 0) {
      console.log(
        'Sample media filenames:',
        // Ensure filename exists, provide fallback if necessary
        mediaData.map((m: Media) => m.filename || 'N/A')
      )
    }

    console.log('\nPayload connection test completed successfully.') // Add spacing
    process.exit(0)
  } catch (error) {
    console.error('Error during Payload connection test:', error)
    process.exit(1) // Exit with error code if test fails
  }
}

// Execute the test function when the script is run
testPayloadConnection()
