import { mongodb } from '../server/db.js';

async function fixReviewsCollection() {
  try {
    await mongodb.connect();
    console.log('Connected to MongoDB');

    // Check existing indexes
    const indexes = await mongodb.reviews.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Check for problematic documents
    const problematicDocs = await mongodb.reviews.find({
      $or: [
        { user: null },
        { product: null },
        { order: null },
        { user: { $exists: false } },
        { product: { $exists: false } },
        { order: { $exists: false } }
      ]
    }).toArray();

    console.log(`\n🔍 Found ${problematicDocs.length} problematic documents`);
    problematicDocs.forEach(doc => {
      console.log(`- ID ${doc.id}: user=${doc.user}, product=${doc.product}, order=${doc.order}`);
    });

    // Option 1: Drop the problematic index
    try {
      await mongodb.reviews.dropIndex('user_1_product_1_order_1');
      console.log('\n✅ Dropped problematic index: user_1_product_1_order_1');
    } catch (error) {
      console.log('\n⚠️ Could not drop index (might not exist):', error.message);
    }

    // Option 2: Delete problematic documents
    if (problematicDocs.length > 0) {
      const deleteResult = await mongodb.reviews.deleteMany({
        $or: [
          { user: null },
          { product: null },
          { order: null },
          { user: { $exists: false } },
          { product: { $exists: false } },
          { order: { $exists: false } }
        ]
      });
      console.log(`\n🗑️ Deleted ${deleteResult.deletedCount} problematic documents`);
    }

    // Create a better index using the correct field names
    try {
      await mongodb.reviews.createIndex(
        { userId: 1, productId: 1, orderId: 1 },
        { 
          unique: true, 
          name: 'userId_1_productId_1_orderId_1',
          background: true
        }
      );
      console.log('\n✅ Created new unique index: userId_1_productId_1_orderId_1');
    } catch (error) {
      console.log('\n⚠️ Could not create new index:', error.message);
    }

    // Check final state
    const finalIndexes = await mongodb.reviews.indexes();
    console.log('\n📋 Final indexes:');
    finalIndexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });

    const totalReviews = await mongodb.reviews.countDocuments();
    console.log(`\n📊 Total reviews after cleanup: ${totalReviews}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongodb.client.close();
  }
}

fixReviewsCollection();
