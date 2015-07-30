using CrmEarlyBound;
using Microsoft.Xrm.Client;
using Microsoft.Xrm.Client.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization;
using System.Web.Http;

namespace WebRole1.Controllers
{
    [DataContract]
    public class TestContactObject
    {
        [DataMember]
        public Guid Id
        {
            get;
            set;
        }
        
        [DataMember]
        public string FirstName
        {
            get;
            set;
        }

        [DataMember]
        public string LastName
        {
            get;
            set;
        }

        [DataMember]
        public string MobilePhone
        {
            get;
            set;
        }

        [DataMember]
        public string Address1_Line1
        {
            get;
            set;
        }

        [DataMember]
        public string Address1_Line2
        {
            get;
            set;
        }

        [DataMember]
        public string Address1_City
        {
            get;
            set;
        }

        [DataMember]
        public string Address1_StateOrProvince
        {
            get;
            set;
        }

        [DataMember]
        public string Address1_PostalCode
        {
            get;
            set;
        }

        [DataMember]
        public int? ContactType
        {
            //Child = 100,000,000. Parent/Guardian = 100,000,001. Other = 100,000,002.
            get;
            set;
        }

        [DataMember]
        public string ContactTypeString
        {
            get;
            set;
        }
    }

    public class ContactsController : ApiController
    {
        // GET api/contacts
        public HttpResponseMessage Get()
        {
            CrmConnection connection = CrmConnection.Parse(Strings.urlCreds);
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var query = from c in ctx.ContactSet
                        select new CrmEarlyBound.Contact
                        {
                            Id = c.Id, 
                            FirstName = c.FirstName,
                            LastName = c.LastName,
                            MobilePhone = c.MobilePhone, 
                            Address1_Line1 = c.Address1_Line1,
                            Address1_Line2 = c.Address1_Line2, 
                            Address1_City = c.Address1_City,
                            Address1_StateOrProvince = c.Address1_StateOrProvince,
                            Address1_PostalCode = c.Address1_PostalCode,
                            new_ContactType = c.new_ContactType
                        };

            var contacts = query.ToList();

            var listReturn = new List<TestContactObject>();
            foreach (Contact c in contacts)
            {
                var returnObject = new TestContactObject();
                returnObject.Id = c.Id;
                returnObject.FirstName = c.FirstName;
                returnObject.LastName = c.LastName;
                returnObject.MobilePhone = c.MobilePhone;
                returnObject.Address1_Line1 = c.Address1_Line1;
                returnObject.Address1_Line2 = c.Address1_Line2; 
                returnObject.Address1_City = c.Address1_City;
                returnObject.Address1_StateOrProvince = c.Address1_StateOrProvince;
                returnObject.Address1_PostalCode = c.Address1_PostalCode;
                returnObject.ContactType = c.new_ContactType;

                listReturn.Add(returnObject);
            }

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            //return listReturn;
            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                listReturn);
        }

        //Household Contacts for Case
        public HttpResponseMessage Get(Guid caseId)
        {
            CrmConnection connection = CrmConnection.Parse(Strings.urlCreds);
            var ctx = new CrmServiceContext(new OrganizationService(connection));

            var queryResult = from n in ctx.new_incident_contactSet
                         join c in ctx.ContactSet on n.contactid equals c.ContactId
                         where n.incidentid == caseId
                         select new TestContactObject
                         {
                            Id = c.ContactId.Value,
                            FirstName = c.FirstName,
                            LastName = c.LastName,
                            MobilePhone = c.MobilePhone,
                            Address1_Line1 = c.Address1_Line1,
                            Address1_Line2 = c.Address1_Line2, 
                            Address1_City = c.Address1_City,
                            Address1_StateOrProvince = c.Address1_StateOrProvince,
                            Address1_PostalCode = c.Address1_PostalCode,
                            ContactType = c.new_ContactType
                         };

            var returnList = new List<TestContactObject>();
            foreach (TestContactObject ctact in queryResult)
            {
                switch (ctact.ContactType)
                {
                    case 100000000:
                        ctact.ContactTypeString = "Child";
                        break;
                    case 100000001:
                        ctact.ContactTypeString = "Parent/Guardian";
                        break;
                    case 100000002:
                        ctact.ContactTypeString = "Other";
                        break;
                }

                returnList.Add(ctact);
            }

            var configuration = GlobalConfiguration.Configuration;
            configuration.Formatters.Remove(configuration.Formatters.XmlFormatter);

            return this.Request.CreateResponse(
                HttpStatusCode.OK,
                returnList);
        }
    }
}
