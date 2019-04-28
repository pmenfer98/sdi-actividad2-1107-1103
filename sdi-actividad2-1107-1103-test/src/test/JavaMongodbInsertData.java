package test;

import java.text.ParseException;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

/**
 * Class tests for inserting data into MongoDB with <b> insertOne </ b> and <b>
 * insertMany </ b>. Clase de pruebas para la inserción de datos en MongoDB con
 * <b>insertOne</b> y <b>insertMany</b>
 * 
 * @author xules
 */
public class JavaMongodbInsertData {
	private MongoClient mongoClient; // Java MongoDB client (Cliente Java MongoDB)
	private MongoDatabase mongodb; // Database object (Objeto base de datos)

	/**
	 * We establish the connection with the database <b>test</b>. Establecemos la
	 * conexión con la base de datos <b>test</b>.
	 */
	public void connectDatabase() {
		try {
			setMongoClient(new MongoClient(new MongoClientURI(
					"mongodb://pablo:sdi@sdi-actividad2-1107-1103-shard-00-00-fj6ok.mongodb.net:27017,sdi-actividad2-1107-1103-shard-00-01-fj6ok.mongodb.net:27017,sdi-actividad2-1107-1103-shard-00-02-fj6ok.mongodb.net:27017/test?ssl=true&replicaSet=sdi-actividad2-1107-1103-shard-0&authSource=admin&retryWrites=true")));
			setMongodb(getMongoClient().getDatabase("test"));
		} catch (Exception ex) {
			System.out.println(ex.toString());
		}
	}

	/**
	 * We use the method <b>insertOne</b> to add a document to the database example.
	 * Usamos el método <b>insertOne</b> para añadir un documento a la base de datos
	 * de ejemplo.
	 */
	public void insertOneDataTest() throws ParseException {
		try {
			MongoCollection<Document> col = getMongodb().getCollection("usuarios");
			col.insertOne(new Document().append("nombre", "admin").append("apellidos", "administrador")
					.append("email", "admin@email.com")
					.append("password", "ebd5359e500475700c6cc3dd4af89cfd0569aa31724a1bf10ed1e3019dcfdb11")
					.append("rol", "admin"));
			col.insertOne(new Document().append("nombre", "Pablo").append("apellidos", "Menendez Fernandez")
					.append("email", "pablomenendezfernandez@gmail.com")
					.append("password", "96b0d5fe128643299e115aba366b5bafeec17655cd4b722df6e4622cce80a96d")
					.append("rol", "user").append("dinero", 50000).append("valid", true));
			for(int i = 0; i<10; i++) {
				col.insertOne(new Document().append("nombre", "User" + i).append("apellidos", "Usuario" + i)
						.append("email", "user" + i + "@gmail.com")
						.append("password", "96b0d5fe128643299e115aba366b5bafeec17655cd4b722df6e4622cce80a96d")
						.append("rol", "user").append("dinero", 100).append("valid", true));
			}
			col = getMongodb().getCollection("ofertas");			
			for(int i = 0; i<100; i++) {
				int counter = i/10;
				col.insertOne(new Document().append("nombre", "oferta" + i).append("detalles", "Detalles de la oferta " + i)
						.append("precio", i+"0")
						.append("propietario", "user" + counter + "@gmail.com")
						.append("fecha", "04/28/2019"));
			}
			for(int i = 0; i<100; i++) {
				int counter = i/10;
				col.insertOne(new Document().append("nombre", "destacada" + i).append("detalles", "Detalles de la oferta destacada " + i)
						.append("precio", i+"0")
						.append("propietario", "user" + counter + "@gmail.com")
						.append("fecha", "04/28/2019")
						.append("destacada", true));
			}
		} catch (Exception ex) {
			System.out.print(ex.toString());
		}

	}

	public void removeDataTest() {
		getMongodb().getCollection("ofertas").drop();
		getMongodb().getCollection("usuarios").drop();
	}

	public MongoClient getMongoClient() {
		return mongoClient;
	}

	public void setMongoClient(MongoClient mongoClient) {
		this.mongoClient = mongoClient;
	}

	public MongoDatabase getMongodb() {
		return mongodb;
	}

	public void setMongodb(MongoDatabase mongodb) {
		this.mongodb = mongodb;
	}

	/**
	 * Adding data to the test database MongoDB Java: insertOne and insertMany
	 * example. Añadiendo datos a la base test de MongoDB con Java: ejemplos
	 * insertOne e insertMany .
	 * 
	 * @param args
	 * @throws ParseException
	 */
	public void dataInsertion() throws ParseException {
		JavaMongodbInsertData javaMongodbInsertData = new JavaMongodbInsertData();
		System.out.println("Conectando a la base");
		javaMongodbInsertData.connectDatabase();
		System.out.println("Eliminando la base");
		javaMongodbInsertData.removeDataTest();
		System.out.println("Insertando en la base");
		javaMongodbInsertData.insertOneDataTest();
	}
}