package mongo.db;

import helper.EntityManagerHelper;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;

import entities.Benutzer;
import entities.Gender;
import entities.Link;

/**
 * Hello world!
 *
 */

public class App {
	public static void main(String[] args) throws NoSuchAlgorithmException {
		
		
		
		EntityManager em = EntityManagerHelper.getInstance().getManager();

		em.getTransaction().begin();
		
		Benutzer benutzer = new Benutzer();
		benutzer.setName("Admin");
		
		String data = "123";
		
		MessageDigest messageDigest=MessageDigest.getInstance("MD5");

        messageDigest.update(data.getBytes());
        byte[] digest=messageDigest.digest();
        StringBuffer sb = new StringBuffer();
        for (byte b : digest) {
            sb.append(Integer.toHexString((int) (b & 0xff)));
        }
		
		benutzer.setPasswort(sb.toString());
		
		String einstellung = "{a=1;b=2;c=2}";
		
		benutzer.setEinstellung(einstellung.getBytes());
		
		Gender gender = new Gender();
		
		gender.setGender("Herren");
		
		Link link = new Link();
		
		link.setLink("www.googel.de");
		link.setName("Google-Jungend");
		
		String tabelle = "{A=1;B=2;C=3}";
		
		link.setTabelle(tabelle);
		link.setUse(true);

		List<Link> listLink = new ArrayList<Link>();
		
		listLink.add(link);
		
		gender.setLink(listLink);
		
		Gender gender2 = new Gender();
		
		gender2.setGender("Damen");
		
		Link link2 = new Link();
		
		link2.setLink("www.googel.de");
		link2.setName("Google-Jungend");
		link2.setTabelle(tabelle);
		link2.setUse(false);
		
		List<Link> listLink2 = new ArrayList<Link>();
		
		listLink2.add(link2);
		
		gender2.setLink(listLink2);
		
		em.persist(benutzer);
		em.persist(gender);
		em.persist(gender2);

		em.getTransaction().commit();

		
//
//		EntityManager em = EntityManagerHelper.getInstance().getManager();
//
//		em.getTransaction().begin();
//
//		Person bob = new Person("Bob", "McRobb");
//
//		Hike cornwall = new Hike();
//
//		cornwall.setDescription("Visiting Land's End");
//		cornwall.setDate(new Date());
//		cornwall.setDifficulty(new BigDecimal("5.5"));
//
//		List<HikeSection> hikeList = new ArrayList<HikeSection>();
//
//		HikeSection a = new HikeSection();
//		a.setStart("Penzance");
//		a.setEnd("Mousehole");
//
//		HikeSection b = new HikeSection();
//		b.setStart("Mousehole");
//		b.setEnd("St. Levan");
//
//		HikeSection c = new HikeSection();
//		c.setStart("St. Levan");
//		c.setEnd("Land's End");
//
//		hikeList.add(a);
//		hikeList.add(b);
//		hikeList.add(c);
//
//		cornwall.setSections(hikeList);
//		
//		Hike isleOfWight = new Hike();
//
//		isleOfWight.setDescription("Exploring Carisbrooke Castle");
//		isleOfWight.setDate(new Date());
//		isleOfWight.setDifficulty(new BigDecimal("7.5"));
//
//		List<HikeSection> hikeList2 = new ArrayList<HikeSection>();
//
//		HikeSection a2 = new HikeSection();
//		a2.setStart("Freshwater");
//		a2.setEnd("Calbourne");
//
//		HikeSection b2 = new HikeSection();
//		b2.setStart("Calbourne");
//		b2.setEnd("Carisbrooke Castle");
//
//		hikeList2.add(a2);
//		hikeList2.add(b2);
//
//		isleOfWight.setSections(hikeList2);
//
//		cornwall.setOrganizer(bob);
//		bob.getOrganizedHikes().add(cornwall);
//
//		isleOfWight.setOrganizer(bob);
//		;
//		bob.getOrganizedHikes().add(isleOfWight);
//
//		em.persist(bob);
//
//		em.getTransaction().commit();
//
//
//
//
//		em.getTransaction().begin();
//
//		Person loadedPerson = em.find(Person.class, bob.getId());
//		if (loadedPerson != null) {
//			if (loadedPerson.getFirstName().equals("Bob")) {
//
//				for (Hike h : loadedPerson.getOrganizedHikes()) {
//					if (h.getDescription().equals("Visiting Land's End")
//							|| h.getDescription().equals(
//									"Exploring Carisbrooke Castle")) {
//						System.out.println("Yaiy");
//					}
//				}
//
//			}
//		} else {
//			System.out.println("loadedPerson ist null");
//		}
//
//		em.getTransaction().commit();
//
//		em.close();

	}
}
