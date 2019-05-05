package test;

import java.text.ParseException;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import test.utils.SeleniumUtils;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class Sdi211071103LabSpringApplicationTests {
	// En Windows (Debe ser la versiÃ³n 65.0.1 y desactivar las actualizacioens
	// automÃ¡ticas)):
	static String PathFirefox64 = "../Firefox/FirefoxPortable.exe";
	static String Geckdriver022 = "geckodriver024win64.exe";
	// ComÃºn a Windows y a MACOSX
	static WebDriver driver = getDriver(PathFirefox64, Geckdriver022);
	static String URL = "http://localhost:8081";

	public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	@Before
	public void setUp() throws Exception {
		driver.navigate().to(URL);
	}

	@After
	public void tearDown() throws Exception {
		driver.manage().deleteAllCookies();
	}

	@BeforeClass
	static public void begin() throws ParseException {
		JavaMongodbInsertData javaMongodbInsertData = new JavaMongodbInsertData();
		javaMongodbInsertData.dataInsertion();
	}

	// Al finalizar la Ãºltima prueba
	@AfterClass
	static public void end() {
		// Cerramos el navegador al finalizar las pruebas
		driver.quit();
	}

	/*
	 * TESTS DE REGISTRO DE USUARIO
	 */

	@Test
	public void test01_registrarse_valido() throws Exception {
		driver.get(URL + "/registrarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("nombre")).click();
		driver.findElement(By.name("nombre")).clear();
		driver.findElement(By.name("nombre")).sendKeys("Miguel");
		driver.findElement(By.name("apellidos")).click();
		driver.findElement(By.name("apellidos")).clear();
		driver.findElement(By.name("apellidos")).sendKeys("Suarez Gonzalez");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("UO123456@uniovi.es");// Comprobar base de datos, si esta,
																			// borrarlo para que el test no falle
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("ContraseñaContra");
		driver.findElement(By.name("repeatPassword")).click();
		driver.findElement(By.name("repeatPassword")).clear();
		driver.findElement(By.name("repeatPassword")).sendKeys("ContraseñaContra");
		driver.findElement(By.id("registerButton")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Home");
		SeleniumUtils.textoPresentePagina(driver, "Tienda");
		SeleniumUtils.textoPresentePagina(driver, "Publicaciones");
		SeleniumUtils.textoPresentePagina(driver, "Añadir oferta");
		SeleniumUtils.textoPresentePagina(driver, "Compras");
	}

	@Test
	public void test02_registrarse_emailRegistrado() throws Exception {
		driver.get(URL + "/registrarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("nombre")).click();
		driver.findElement(By.name("nombre")).clear();
		driver.findElement(By.name("nombre")).sendKeys("Pablo");
		driver.findElement(By.name("apellidos")).click();
		driver.findElement(By.name("apellidos")).clear();
		driver.findElement(By.name("apellidos")).sendKeys("Menendez Fernandez");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("ContraseñaContra");
		driver.findElement(By.name("repeatPassword")).click();
		driver.findElement(By.name("repeatPassword")).clear();
		driver.findElement(By.name("repeatPassword")).sendKeys("ContraseñaContra");
		driver.findElement(By.id("registerButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	@Test
	public void test03_registrarse_emailVacio() throws Exception {
		driver.get(URL + "/registrarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("nombre")).click();
		driver.findElement(By.name("nombre")).clear();
		driver.findElement(By.name("nombre")).sendKeys("Pablo");
		driver.findElement(By.name("apellidos")).click();
		driver.findElement(By.name("apellidos")).clear();
		driver.findElement(By.name("apellidos")).sendKeys("Menendez Fernandez");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("ContraseñaContra");
		driver.findElement(By.name("repeatPassword")).click();
		driver.findElement(By.name("repeatPassword")).clear();
		driver.findElement(By.name("repeatPassword")).sendKeys("ContraseñaContra");
		driver.findElement(By.id("registerButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	@Test
	public void test04_registrarse_repetirContraseñaFallido() throws Exception {
		driver.get(URL + "/registrarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("nombre")).click();
		driver.findElement(By.name("nombre")).clear();
		driver.findElement(By.name("nombre")).sendKeys("Pablo");
		driver.findElement(By.name("apellidos")).click();
		driver.findElement(By.name("apellidos")).clear();
		driver.findElement(By.name("apellidos")).sendKeys("Menendez Fernandez");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("emailEjemplo@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("ContraseñaContra");
		driver.findElement(By.name("repeatPassword")).click();
		driver.findElement(By.name("repeatPassword")).clear();
		driver.findElement(By.name("repeatPassword")).sendKeys("Contraseña");
		driver.findElement(By.id("registerButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	/*
	 * TESTS DE INICIO DE SESION
	 */

	@Test
	public void test04_identificarse_valido() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.id("mTienda"));
		SeleniumUtils.esperarSegundos(driver, 5);

		SeleniumUtils.textoPresentePagina(driver, "Home");
		SeleniumUtils.textoPresentePagina(driver, "Tienda");
		SeleniumUtils.textoPresentePagina(driver, "Publicaciones");
		SeleniumUtils.textoPresentePagina(driver, "Añadir oferta");
		SeleniumUtils.textoPresentePagina(driver, "Compras");

		driver.get(URL + "/desconectarse");

	}

	@Test
	public void test05_identificarse_contraseñaErronea() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("contraseñaErronea");
		driver.findElement(By.id("logginButton")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	@Test
	public void test06_identificarse_emailVacio() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	@Test
	public void test07_identificarse_emailInexistente() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("emailInexistente@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	/*
	 * TESTS DE CIERRE DE SESION
	 */

	@Test
	public void test08_desconectarse_redireccionAlLogin() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Home");
		SeleniumUtils.textoPresentePagina(driver, "Tienda");
		SeleniumUtils.textoPresentePagina(driver, "Publicaciones");
		SeleniumUtils.textoPresentePagina(driver, "Añadir oferta");
		SeleniumUtils.textoPresentePagina(driver, "Compras");
		SeleniumUtils.textoPresentePagina(driver, "Desconectarse");

		driver.findElement(By.id("mDesconectarse")).click();

		SeleniumUtils.esperarSegundos(driver, 5);

		SeleniumUtils.textoPresentePagina(driver, "Identificación de usuario");
		SeleniumUtils.textoPresentePagina(driver, "Email:");
		SeleniumUtils.textoPresentePagina(driver, "Password:");
		SeleniumUtils.textoPresentePagina(driver, "Aceptar");

		SeleniumUtils.textoNoPresentePagina(driver, "Desconectarse");

	}

	@Test
	public void test09_desconectarse_comprobarBotonLogin() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		try {
			driver.findElement(By.id("mDesconectarse"));
			SeleniumUtils.textoNoPresentePagina(driver, "Desconectarse");
		} catch (NoSuchElementException e) {
			return;
		}
		throw new org.openqa.selenium.NoSuchElementException("El elemento no debería aparecer");

	}

	/*
	 * TEST DE LISTADO DE USUARIOS
	 */
	@Test
	public void test10_listarUsuarios() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("admin@email.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("admin");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.linkText("Listar usuarios")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Usuarios en el sistema");

		SeleniumUtils.textoNoPresentePagina(driver, "admin@email.com");

		SeleniumUtils.textoPresentePagina(driver, "pablomenendezfernandez@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user0@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user1@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user2@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user3@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user4@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user5@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user6@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user7@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user8@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user9@gmail.com");
	}

	/*
	 * TEST DE BORRADO MÚLTIPLE DE USUARIOS
	 */

	@Test
	public void test11_borradoMultipleDeUsuarios_PrimerUsuario() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("admin@email.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("admin");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.name("idsUser")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("DeleteButton")).click();

		SeleniumUtils.esperarSegundos(driver, 3);
	
		SeleniumUtils.textoNoPresentePagina(driver, "pablomenendezfernandez@gmail.com");

		SeleniumUtils.textoPresentePagina(driver, "user1@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user2@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user3@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user4@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user5@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user6@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user7@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user8@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user9@gmail.com");

	}

	@Test
	public void test12_borradoMultipleDeUsuarios_UltimoUsuario() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("admin@email.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("admin");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.xpath(
				"(.//*[normalize-space(text()) and normalize-space(.)='user9@gmail.com'])[1]/following::input[1]"))
				.click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("DeleteButton")).click();

		SeleniumUtils.esperarSegundos(driver, 3);
		
		SeleniumUtils.textoNoPresentePagina(driver, "pablomenendezfernandez@gmail.com");

		SeleniumUtils.textoPresentePagina(driver, "user0@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user1@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user2@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user3@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user4@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user5@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user6@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user7@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user8@gmail.com");

		SeleniumUtils.textoNoPresentePagina(driver, "user9@gmail.com");

	}

	@Test
	public void test13_borradoMultipleDeUsuarios_TresUsuarios() throws Exception {
		driver.get("http://localhost:8081/desconectarse");
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("admin@email.com");
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("admin");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.xpath(
				"(.//*[normalize-space(text()) and normalize-space(.)='user1@gmail.com'])[1]/following::input[1]"))
				.click();
		driver.findElement(By.xpath(
				"(.//*[normalize-space(text()) and normalize-space(.)='user2@gmail.com'])[1]/following::input[1]"))
				.click();
		driver.findElement(By.xpath(
				"(.//*[normalize-space(text()) and normalize-space(.)='user3@gmail.com'])[1]/following::input[1]"))
				.click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("DeleteButton")).click();

		
		SeleniumUtils.textoNoPresentePagina(driver, "pablomenendezfernandez@gmail.com");


		SeleniumUtils.textoNoPresentePagina(driver, "user1@gmail.com");
		SeleniumUtils.textoNoPresentePagina(driver, "user2@gmail.com");
		SeleniumUtils.textoNoPresentePagina(driver, "user3@gmail.com");

		SeleniumUtils.textoPresentePagina(driver, "user4@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user5@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user6@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user7@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "user8@gmail.com");

		SeleniumUtils.textoNoPresentePagina(driver, "user9@gmail.com");

	}

	/*
	 * TEST DE SUBIDA DE OFERTAS
	 */

	@Test
	public void test14_subirOferta_valido() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 3);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.linkText("Añadir oferta")).click();
		SeleniumUtils.esperarSegundos(driver, 3);
		driver.findElement(By.id("nombre")).click();
		driver.findElement(By.id("nombre")).clear();
		driver.findElement(By.id("nombre")).sendKeys("Oferta de prueba");
		SeleniumUtils.esperarSegundos(driver, 3);
		driver.findElement(By.id("detalles")).click();
		driver.findElement(By.id("detalles")).clear();
		driver.findElement(By.id("detalles")).sendKeys("Prueba");
		SeleniumUtils.esperarSegundos(driver, 3);
		driver.findElement(By.id("precio")).click();
		driver.findElement(By.id("precio")).clear();
		driver.findElement(By.id("precio")).sendKeys("60");
		driver.findElement(By.id("botonAgregar")).click();
		driver.findElement(By.id("mDesconectarse")).click();
	}

	@Test
	public void test15_subirOferta_invalido() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 3);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.linkText("Añadir oferta")).click();
		SeleniumUtils.esperarSegundos(driver, 3);
		driver.findElement(By
				.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Agregar oferta'])[2]/following::form[1]"))
				.click();
		driver.findElement(By.id("detalles")).click();
		driver.findElement(By.id("detalles")).clear();
		driver.findElement(By.id("detalles")).sendKeys("hola");
		driver.findElement(By.id("precio")).click();
		driver.findElement(By.id("precio")).clear();
		driver.findElement(By.id("precio")).sendKeys("20");
		driver.findElement(By.id("botonAgregar")).click();
		driver.findElement(By.id("mDesconectarse")).click();

		SeleniumUtils.esperarSegundos(driver, 3);
	}

	@Test
	public void test16_listadoDeOfertasPropias() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.linkText("Publicaciones")).click();
		SeleniumUtils.textoPresentePagina(driver, "Mis publicaciones");
		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Nombre");
		SeleniumUtils.textoPresentePagina(driver, "Detalles");
		SeleniumUtils.textoPresentePagina(driver, "Fecha");
		SeleniumUtils.textoPresentePagina(driver, "Precio");

		for (int i = 0; i < 10; i++) {
			SeleniumUtils.textoPresentePagina(driver, "oferta5" + i);
		}

	}

	/*
	 * TEST DE DAR DE BAJA UNA OFERTA
	 */

	@Test
	public void test17_darDeBajaUnaOferta_primera() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.linkText("Publicaciones")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Eliminar")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("mDesconectarse")).click();

		SeleniumUtils.textoNoPresentePagina(driver, "oferta50");
		SeleniumUtils.textoNoPresentePagina(driver, "Detalles de la oferta 50");

	}

	@Test
	public void test18_darDeBajaUnaOferta_ultima() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Publicaciones")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.xpath(
				"(.//*[normalize-space(text()) and normalize-space(.)='Detalles de la oferta destacada 59'])[1]/following::a[1]"))
				.click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("mDesconectarse")).click();

	}

	@Test
	public void test19_buscarOfertasCampoVacío() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Tienda")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("busqueda")).click();
		driver.findElement(By
				.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Desconectarse'])[1]/following::span[2]"))
				.click();
		SeleniumUtils.esperarSegundos(driver, 5);

		// Mostrando que aparece el listado de ofertas disponibles en el sistema
		SeleniumUtils.textoPresentePagina(driver, "Ofertas");
		SeleniumUtils.textoPresentePagina(driver, "destacada0");
		SeleniumUtils.textoPresentePagina(driver, "destacada1");
		SeleniumUtils.textoPresentePagina(driver, "destacada2");
		SeleniumUtils.textoPresentePagina(driver, "destacada3");
		SeleniumUtils.textoPresentePagina(driver, "destacada4");

		driver.findElement(By.id("mDesconectarse")).click();
	}

	@Test
	public void test20_buscarOfertasTextoInexistente() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Tienda")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("busqueda")).click();
		driver.findElement(By.name("busqueda")).clear();
		driver.findElement(By.name("busqueda")).sendKeys("dinosaurio");
		driver.findElement(By.name("busqueda")).sendKeys(Keys.ENTER);

		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Ofertas");

		// Mostrando que no figura ninguna oferta, ya que no hay ningún botón "Comprar"
		SeleniumUtils.textoNoPresentePagina(driver, "Comprar");

		driver.findElement(By.xpath(
				"(.//*[normalize-space(text()) and normalize-space(.)='Desconectarse'])[1]/following::button[1]"))
				.click();
	}

	@Test
	public void test21_buscarOfertasExistentes() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Tienda")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("busqueda")).click();
		driver.findElement(By.name("busqueda")).clear();
		driver.findElement(By.name("busqueda")).sendKeys("oferta7");
		driver.findElement(By.name("busqueda")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);

		SeleniumUtils.textoPresentePagina(driver, "Ofertas");

		// Mostrando las primeras ofertas que aparecen al introducir oferta1
		SeleniumUtils.textoPresentePagina(driver, "oferta7");
		SeleniumUtils.textoPresentePagina(driver, "oferta70");
		SeleniumUtils.textoPresentePagina(driver, "oferta71");
		SeleniumUtils.textoPresentePagina(driver, "oferta72");
		SeleniumUtils.textoPresentePagina(driver, "oferta73");

		driver.findElement(By.xpath(
				"(.//*[normalize-space(text()) and normalize-space(.)='Desconectarse'])[1]/following::button[1]"))
				.click();
	}

	@Test
	public void test22_comprarSaldoPositivo() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.linkText("Tienda")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("busqueda")).click();
		driver.findElement(By.name("busqueda")).clear();
		driver.findElement(By.name("busqueda")).sendKeys("oferta1");
		driver.findElement(By.name("busqueda")).clear();
		driver.findElement(By.name("busqueda")).sendKeys("oferta1");
		driver.findElement(By.name("busqueda")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Comprar")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("10 €")).click();

		SeleniumUtils.esperarSegundos(driver, 5);

		driver.findElement(By.id("cantidad")).getAttribute("90€");

		driver.findElement(By.id("mDesconectarse")).click();
	}

	@Test
	public void test23_comprarSaldo0() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Tienda")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("busqueda")).click();
		driver.findElement(By.name("busqueda")).clear();
		driver.findElement(By.name("busqueda")).sendKeys("oferta9");
		driver.findElement(By.name("busqueda")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Comprar")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("90 €")).click();

		SeleniumUtils.esperarSegundos(driver, 5);

		driver.findElement(By.id("cantidad")).getAttribute("0€");

		driver.findElement(By.id("mDesconectarse")).click();
	}

	@Test
	public void test24_comprarSaldoNegativo() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Tienda")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("busqueda")).click();
		driver.findElement(By.name("busqueda")).clear();
		driver.findElement(By.name("busqueda")).sendKeys("oferta4");
		driver.findElement(By.name("busqueda")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By
				.xpath("(.//*[normalize-space(text()) and normalize-space(.)='oferta40 - 400 €'])[1]/following::a[1]"))
				.click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("400 €")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "No tienes suficiente dinero");
		driver.findElement(By.id("mDesconectarse")).click();
	}

	@Test
	public void test25_listadoOfertasCompradas() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Compras")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Mis compras");
		SeleniumUtils.textoPresentePagina(driver, "oferta1");
		SeleniumUtils.textoPresentePagina(driver, "oferta9");

		SeleniumUtils.textoNoPresentePagina(driver, "oferta4");

		driver.findElement(By.id("mDesconectarse")).click();
	}

	@Test
	public void test26_marcarComoDestacada1() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user8@gmail.com");
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Añadir oferta")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("nombre")).click();
		driver.findElement(By.id("nombre")).clear();
		driver.findElement(By.id("nombre")).sendKeys("Oferta para destacar");
		driver.findElement(By.id("detalles")).clear();
		driver.findElement(By.id("detalles")).sendKeys("Esto es una prueba");
		driver.findElement(By.id("precio")).click();
		driver.findElement(By.id("precio")).clear();
		driver.findElement(By.id("precio")).sendKeys("30");
		driver.findElement(By.id("destacada")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("botonAgregar")).click();

		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Nueva oferta añadida");
		driver.findElement(By.id("cantidad")).getAttribute("80€");

		driver.findElement(By.id("mDesconectarse")).click();
	}

	@Test
	public void test27_marcarComoDestacada2() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user8@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Tienda")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("busqueda")).click();
		driver.findElement(By.name("busqueda")).clear();
		driver.findElement(By.name("busqueda")).sendKeys("oferta6");
		driver.findElement(By.name("busqueda")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Comprar")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("60 €")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Añadir oferta")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("nombre")).click();
		driver.findElement(By.id("nombre")).clear();
		driver.findElement(By.id("nombre")).sendKeys("Nueva oferta para destacar");
		driver.findElement(By.id("detalles")).click();
		driver.findElement(By.id("detalles")).clear();
		driver.findElement(By.id("detalles")).sendKeys("Esto es una prueba");
		driver.findElement(By.id("precio")).click();
		driver.findElement(By.id("precio")).clear();
		driver.findElement(By.id("precio")).sendKeys("80");
		driver.findElement(By.id("destacada")).click();
		driver.findElement(By.id("botonAgregar")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Nueva oferta añadida");
		driver.findElement(By.id("cantidad")).getAttribute("0€");
		driver.findElement(By.id("mDesconectarse")).click();
	}

	@Test
	public void test28_marcarComoDestacada3() throws Exception {
		driver.get(URL + "/identificarse");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("user8@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By
				.xpath("(.//*[normalize-space(text()) and normalize-space(.)='destacada1 - 10 €'])[1]/following::a[1]"))
				.click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("10 €")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Añadir oferta")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("nombre")).click();
		driver.findElement(By.id("nombre")).clear();
		driver.findElement(By.id("nombre")).sendKeys("Oferta para destacar");
		driver.findElement(By.id("nombre")).clear();
		driver.findElement(By.id("nombre")).sendKeys("Oferta para destacar 3");
		driver.findElement(By.id("detalles")).click();
		driver.findElement(By.id("detalles")).clear();
		driver.findElement(By.id("detalles")).sendKeys("Esto es una prueba");
		driver.findElement(By.id("precio")).click();
		driver.findElement(By.id("precio")).clear();
		driver.findElement(By.id("precio")).sendKeys("80");
		driver.findElement(By.id("destacada")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("botonAgregar")).click();
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Desconectarse'])[1]/following::div[2]"))
				.click();

		SeleniumUtils.textoPresentePagina(driver, "No tienes suficiente dinero para destacar la oferta");

		driver.findElement(By.id("mDesconectarse")).click();
	}

	@Test
	public void test29_login_Valido() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("email")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.id("password")).click();
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("user123");
		driver.findElement(By.id("boton-login")).click();

		SeleniumUtils.esperarSegundos(driver, 5);

		SeleniumUtils.textoPresentePagina(driver, "Nombre");
		SeleniumUtils.textoPresentePagina(driver, "Detalles");
		SeleniumUtils.textoPresentePagina(driver, "Precio");
		SeleniumUtils.textoPresentePagina(driver, "Vendedor");
	}

	@Test
	public void test30_login_contraseñaIncorrecta() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("email")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.id("password")).click();
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("contraseñaincorrecta");
		driver.findElement(By.id("boton-login")).click();

		SeleniumUtils.textoPresentePagina(driver, "Usuario no encontrado");
	}

	@Test
	public void test31_login_contraseñaVacia() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("email")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.id("boton-login")).click();

		SeleniumUtils.textoPresentePagina(driver, "Usuario no encontrado");
	}

	@Test
	public void test32_listadoOfertasDisponibles() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("email")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.id("password")).click();
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("user123");
		driver.findElement(By.id("boton-login")).click();

		SeleniumUtils.esperarSegundos(driver, 5);

		for (int i = 0; i < 9; i++) {
			SeleniumUtils.textoPresentePagina(driver, "oferta" + i);
		}
		for (int i = 0; i < 9; i++) {
			SeleniumUtils.textoPresentePagina(driver, "destacada" + i);
		}

	}

	@Test
	public void test33_enviarMensaje() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("email")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.id("password")).click();
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("user123");
		driver.findElement(By.id("boton-login")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Mensajes")).click();
		driver.findElement(By.id("contenidoMensaje")).click();
		driver.findElement(By.id("contenidoMensaje")).clear();
		driver.findElement(By.id("contenidoMensaje")).sendKeys("Esto es un mensaje de prueba");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Mensajes'])[1]/following::span[2]"))
				.click();
		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Esto es un mensaje de prueba");

	}

	@Test
	public void test34_enviarMensaje_conversacionAbierta() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("email")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.id("password")).click();
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("user123");
		driver.findElement(By.id("password")).sendKeys(Keys.ENTER);
		driver.findElement(By.id("boton-login")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Mensajes")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("contenidoMensaje")).click();
		driver.findElement(By.id("contenidoMensaje")).clear();

		driver.findElement(By.id("contenidoMensaje")).sendKeys("Segundo mensaje de prueba");
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Mensajes'])[1]/following::span[2]"))
				.click();

		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Esto es un mensaje de prueba");
		SeleniumUtils.textoPresentePagina(driver, "Segundo mensaje de prueba");

	}

	@Test
	public void test35_mostrarListadoConversaciones() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.id("password")).click();
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("user123");
		driver.findElement(By.id("boton-login")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("btnConversaciones")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		// Mostrando la conversación previamente creada
		SeleniumUtils.textoPresentePagina(driver, "oferta0");
	}

	@Test
	public void test36_eliminarPrimeraConversacion() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("email")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user5@gmail.com");
		driver.findElement(By.id("password")).click();
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("user123");
		driver.findElement(By.id("boton-login")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='user1@gmail.com'])[1]/following::a[1]"))
				.click();
		driver.findElement(By.id("contenidoMensaje")).click();
		driver.findElement(By.id("contenidoMensaje")).clear();
		driver.findElement(By.id("contenidoMensaje")).sendKeys("Mensaje para rellenar");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Mensajes'])[1]/following::span[2]"))
				.click();
		driver.findElement(By.linkText("Lista de ofertas")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='user2@gmail.com'])[8]/following::a[1]"))
				.click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Mensajes'])[1]/following::div[2]"))
				.click();
		driver.findElement(By.id("contenidoMensaje")).click();
		driver.findElement(By.id("contenidoMensaje")).click();
		driver.findElement(By.id("contenidoMensaje")).clear();
		driver.findElement(By.id("contenidoMensaje")).sendKeys("Último mensaje");
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Mensajes'])[1]/following::span[2]"))
				.click();
		driver.findElement(By.linkText("Ver conversaciones")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("eliminarConver")).click();

	}

	
	@Test
	public void test38_comprobarLeido()throws Exception{
		test38A_enviarMensaje();
		test38B_leerElMensaje();
		test38C_ComprobarLeido();
	}
	
	public void test38A_enviarMensaje() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		SeleniumUtils.esperarSegundos(driver, 2);
		driver.findElement(By.id("email")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user6@gmail.com");
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("user123");
		driver.findElement(By.id("boton-login")).click();
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='user1@gmail.com'])[2]/following::a[1]"))
				.click();
		driver.findElement(By.id("contenidoMensaje")).click();
		driver.findElement(By.id("contenidoMensaje")).click();
		driver.findElement(By.id("contenidoMensaje")).clear();
		driver.findElement(By.id("contenidoMensaje")).sendKeys("Hola, buenas tardes");
		SeleniumUtils.esperarSegundos(driver, 2);
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Mensajes'])[1]/following::span[2]"))
				.click();
		driver.findElement(By.linkText("Desconectarse")).click();

	}

	
	public void test38B_leerElMensaje() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		SeleniumUtils.esperarSegundos(driver, 2);
		driver.findElement(By.id("email")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user1@gmail.com");
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("user123");
		SeleniumUtils.esperarSegundos(driver, 2);
		driver.findElement(By.id("boton-login")).click();
		driver.findElement(By.id("btnConversaciones")).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		driver.findElement(
				By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Eliminar'])[1]/following::a[1]"))
				.click();

	}

	
	public void test38C_ComprobarLeido() throws Exception {
		driver.get("http://localhost:8081/cliente.html");
		driver.findElement(By.id("email")).click();
		driver.findElement(By.id("email")).clear();
		driver.findElement(By.id("email")).sendKeys("user6@gmail.com");
		driver.findElement(By.id("password")).clear();
		driver.findElement(By.id("password")).sendKeys("user123");
		driver.findElement(By.id("boton-login")).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		driver.findElement(By.id("btnConversaciones")).click();
		SeleniumUtils.esperarSegundos(driver, 2);
		driver.findElement(By.id("entrarConver")).click();
	}

}
