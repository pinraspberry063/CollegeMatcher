public class MainActivity extends AppCompatActivity {

    private FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        db = FirebaseFirestore.getInstance();

        // Call method to create forum documents
        createForumDocuments();
    }

    private void createForumDocuments() {
        db.collection("CompleteColleges")
            .get()
            .addOnSuccessListener(querySnapshot -> {
                for (QueryDocumentSnapshot document : querySnapshot) {
                    String schoolName = document.getString("school_name");

                    Map<String, Object> forumData = new HashMap<>();
                    forumData.put("created_by", "Admin");

                    db.collection("Forums").document(schoolName)
                        .set(forumData)
                        .addOnSuccessListener(aVoid -> {
                            // Document successfully written
                        })
                        .addOnFailureListener(e -> {
                            // Handle error
                        });
                }
            })
            .addOnFailureListener(e -> {
                // Handle error
            });
    }
}
