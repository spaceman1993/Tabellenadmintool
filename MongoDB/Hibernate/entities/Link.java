package entities;

import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Embeddable;
import javax.persistence.OrderColumn;

@Embeddable
public class Link {

	private String name;
	private String link;
	private boolean use;
	private String tabelle;
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}
	
	public boolean isUse() {
		return use;
	}

	public void setUse(boolean use) {
		this.use = use;
	}

	public String getTabelle() {
		return tabelle;
	}

	public void setTabelle(String tabelle) {
		this.tabelle = tabelle;
	}	
}
